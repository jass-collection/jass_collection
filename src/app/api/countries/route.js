import { NextResponse } from 'next/server';
import { getCountriesStates } from '../../../lib/data';

export async function GET() {
  try {
    const countries = await getCountriesStates();
    return NextResponse.json(countries);
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return NextResponse.json(
      { message: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}

