import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const ORDER_STATUSES = new Set(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
const PAYMENT_STATUSES = new Set(['pending', 'completed', 'failed']);

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const status = data?.status;
    const paymentStatus = data?.paymentStatus;

    if (status && !ORDER_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    if (paymentStatus && !PAYMENT_STATUSES.has(paymentStatus)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      // Get current order and its items
      const existingOrder = await tx.order.findUnique({
        where: { id: params.id },
        include: { items: true }
      });

      if (!existingOrder) {
        throw new Error('Order not found');
      }

      // If status is changing TO cancelled and wasn't already cancelled
      if (status === 'cancelled' && existingOrder.status !== 'cancelled') {
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
        }
      }
      // If status is changing FROM cancelled to something else (e.g., restored)
      else if (status && status !== 'cancelled' && existingOrder.status === 'cancelled') {
        for (const item of existingOrder.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock to restore order for ${product.name}`);
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      return await tx.order.update({
        where: { id: params.id },
        data: {
          ...(status ? { status } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
        },
      });
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
