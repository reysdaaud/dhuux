import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin'; // Adjust import as needed

interface PaystackResponse {
  status: boolean;
  data: {
    amount: number;
    status: string;
    reference: string;
  };
}

const COIN_PACKAGES = [
  { amount: 1, coins: 100 },
  { amount: 2, coins: 220 },
  { amount: 50, coins: 600 },
];

export async function POST(req: Request) {
  const { reference, userId, amount } = await req.json();
  const db = getFirestore(getFirebaseAdmin());

  // Find the coin package
  const package_ = COIN_PACKAGES.find((p) => p.amount === amount);
  if (!package_) {
    return NextResponse.json({ status: false, message: 'Invalid package' }, { status: 400 });
  }

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Create user with empty history, then add payment with arrayUnion
    await setDoc(userRef, {
      coins: package_.coins,
      history: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await updateDoc(userRef, {
      history: arrayUnion({
        coins: package_.coins,
        timestamp: serverTimestamp(),
        reference,
        status: 'success',
      }),
    });
  } else {
    const currentCoins = userSnap.data().coins || 0;
    await updateDoc(userRef, {
      coins: currentCoins + package_.coins,
      history: arrayUnion({
        coins: package_.coins,
        timestamp: serverTimestamp(),
        reference,
        status: 'success',
      }),
      updatedAt: serverTimestamp(),
    });
  }

  return NextResponse.json({ status: true, message: 'Payment verified and coins credited.' });
}
