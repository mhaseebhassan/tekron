import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    const data = await request.json();
    const guestEmail = data?.email || '';
    const guestName = data?.name || 'Guest';

    let userId = session?.user?.id;

    if (!userId) {
      if (!guestEmail) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: guestEmail },
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const createdUser = await prisma.user.create({
          data: {
            name: guestName,
            email: guestEmail,
            role: 'user',
          },
        });
        userId = createdUser.id;
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItems = [];

      for (const item of data.items) {
        // Handle Mongoose ID style if passed from frontend
        const productId = typeof item.product === 'object' ? item.product._id : item.product;

        const product = await tx.product.findUnique({
          where: { id: productId }
        });

        if (!product) {
          throw new Error(`Product ${productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        // Update product stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity }
        });

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        totalAmount += product.price * item.quantity;
      }

      return await tx.order.create({
        data: {
          userId,
          totalAmount,
          street: data.shippingAddress?.street || '',
          city: data.shippingAddress?.city || '',
          state: data.shippingAddress?.state || '',
          zipCode: data.shippingAddress?.zipCode || '',
          country: data.shippingAddress?.country || '',
          items: {
            create: orderItems
          }
        },
        include: {
          items: true
        }
      });
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('stock') ? 400 : 500 }
    );
  }
} 
