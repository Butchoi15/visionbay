import { products as initialProducts } from '../data/products';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  condition?: string;
  additionalImages?: string[];
  isUnlocked?: boolean;
  specSheet?: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: 'Inquiry' | 'Available' | 'Pending' | 'Completed';
  date: string;
  inquiryMessage?: string;
  trackingNumber?: string;
  shippingDetails?: {
    fullName: string;
    email: string;
    mobileNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  orderId?: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'Unread' | 'Read' | 'Replied';
}

import { db as firestore } from './firebase';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, getDoc, query, where, orderBy } from 'firebase/firestore';

class Database {
  // We keep `init` purely for any fallback seeding logic, though Firebase manages collections dynamically.
  async init() {
    try {
      const currentProducts = await this.getProducts();
      const existingIds = new Set(currentProducts.map(p => p.id));

      for (const p of initialProducts) {
        if (!existingIds.has(p.id)) {
          await this.saveProduct({ ...p, sku: p.sku || p.id } as Product);
        }
      }
    } catch (e) {
      console.error("Failed to seed initial products:", e);
    }
  }

  async getUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(firestore, 'users'));
    return querySnapshot.docs.map(doc => doc.data() as User);
  }

  async saveUser(user: User): Promise<void> {
    await setDoc(doc(firestore, 'users', user.id), user);
  }

  async updateUser(user: User): Promise<void> {
    await updateDoc(doc(firestore, 'users', user.id), user as any);
  }

  async deleteUser(id: string): Promise<void> {
    await deleteDoc(doc(firestore, 'users', id));
  }

  async getProducts(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(firestore, 'products'));
    return querySnapshot.docs.map(doc => doc.data() as Product);
  }

  async saveProduct(product: Product): Promise<void> {
    // Ensure the ID is set
    await setDoc(doc(firestore, 'products', product.id), product);
  }

  async updateProduct(product: Product): Promise<void> {
    await updateDoc(doc(firestore, 'products', product.id), product as any);
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(firestore, 'products', id));
  }

  async getOrders(): Promise<Order[]> {
    const querySnapshot = await getDocs(collection(firestore, 'orders'));
    return querySnapshot.docs.map(doc => doc.data() as Order);
  }

  async saveOrder(order: Order): Promise<void> {
    await setDoc(doc(firestore, 'orders', order.id), order);
  }

  async updateOrder(order: Order): Promise<void> {
    await updateDoc(doc(firestore, 'orders', order.id), order as any);
  }

  async deleteOrder(id: string): Promise<void> {
    await deleteDoc(doc(firestore, 'orders', id));
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      collection(firestore, 'notifications'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const notifications = querySnapshot.docs.map(doc => doc.data() as Notification);
    // Sort client-side for simplicity, or add an index for orderBy in Firestore
    return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addNotification(notification: Notification): Promise<void> {
    await setDoc(doc(firestore, 'notifications', notification.id), notification);
  }

  async markNotificationRead(id: string): Promise<void> {
    await updateDoc(doc(firestore, 'notifications', id), { read: true });
  }

  // --- Contact Messages ---

  async getMessages(): Promise<ContactMessage[]> {
    const querySnapshot = await getDocs(collection(firestore, 'messages'));
    const messages = querySnapshot.docs.map(doc => doc.data() as ContactMessage);
    return messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async saveMessage(message: ContactMessage): Promise<void> {
    await setDoc(doc(firestore, 'messages', message.id), message);
  }

  async updateMessage(message: ContactMessage): Promise<void> {
    await updateDoc(doc(firestore, 'messages', message.id), message as any);
  }

  async deleteMessage(id: string): Promise<void> {
    await deleteDoc(doc(firestore, 'messages', id));
  }
}

export const db = new Database();
