import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { products as seedProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// GET /api/products
export async function GET() {
  try {
    const count = await prisma.product.count();

    if (count === 0 && seedProducts.length > 0) {
      await prisma.product.createMany({
        data: seedProducts.map((product) => ({
          name: product.name,
          description: product.details || product.description,
          price: product.price,
          stock: 25,
          category: product.category,
          image: product.image,
        })),
      });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const payload = products.map((product) => ({
      ...product,
      slug: slugify(product.name),
      details: product.description,
      tags: [],
    }));

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        category: data.category,
        image: data.image
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating product' },
      { status: 500 }
    );
  }
} 
