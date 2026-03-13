import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const SETTINGS_ID = 'default';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.storeSettings.findUnique({
      where: { id: SETTINGS_ID },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const settings = await prisma.storeSettings.upsert({
      where: { id: SETTINGS_ID },
      update: {
        storeName: data?.storeName || 'Tekron Store',
        supportEmail: data?.supportEmail || null,
        supportPhone: data?.supportPhone || null,
        address: data?.address || null,
        currency: data?.currency || 'USD',
        taxRate: Number(data?.taxRate || 0),
        shippingFlatRate: Number(data?.shippingFlatRate || 0),
        freeShippingThreshold: Number(data?.freeShippingThreshold || 0),
      },
      create: {
        id: SETTINGS_ID,
        storeName: data?.storeName || 'Tekron Store',
        supportEmail: data?.supportEmail || null,
        supportPhone: data?.supportPhone || null,
        address: data?.address || null,
        currency: data?.currency || 'USD',
        taxRate: Number(data?.taxRate || 0),
        shippingFlatRate: Number(data?.shippingFlatRate || 0),
        freeShippingThreshold: Number(data?.freeShippingThreshold || 0),
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
