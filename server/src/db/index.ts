import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { products as initialProducts, type Product } from '../../../src/data/products';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  avatar?: string;
  role: 'customer' | 'admin';
  address?: {
    street?: string;
    city?: string;
    district?: string;
    note?: string;
  };
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // e.g. KT00101
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  paymentMethod: 'cod' | 'khqr' | 'card';
  paymentStatus: 'pending' | 'paid';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusTextKh: string;
  createdAt: string;
  timeline: {
    title: string;
    time: string;
    description: string;
    completed: boolean;
  }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface DatabaseSchema {
  products: Product[];
  users: User[];
  orders: Order[];
  contactMessages: ContactMessage[];
}

const DB_DIR = path.resolve(process.cwd(), 'server/data');
const DB_FILE = path.join(DB_DIR, 'db.json');

class JSONDatabase {
  private data: DatabaseSchema = {
    products: [],
    users: [],
    orders: [],
    contactMessages: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.ensureAdminUser();
      } catch (err) {
        console.error('Error reading db.json, re-initializing...', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  private ensureAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@esokein.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUser = this.getUserByEmail(adminEmail);
    if (!adminUser) {
      const adminPasswordHash = bcrypt.hashSync(adminPass, 10);
      this.data.users.unshift({
        id: 'usr_admin_root',
        name: 'Admin SOKEIN',
        email: adminEmail,
        phone: '087 812 643',
        passwordHash: adminPasswordHash,
        avatar: '👑',
        role: 'admin',
        address: {
          street: 'SOKEIN HQ',
          city: 'ភ្នំពេញ',
        },
        createdAt: new Date().toISOString(),
      });
      this.saveSync();
    }
  }

  private seedInitialData() {
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);

    const demoUser: User = {
      id: 'usr_demo_1',
      name: 'សុខ សុវណ្ណ',
      email: 'soksouvann@gmail.com',
      phone: '012 345 678',
      passwordHash: defaultPasswordHash,
      avatar: '👤',
      role: 'customer',
      address: {
        street: '#123 ផ្លូវ 271',
        district: 'ទួលគោក',
        city: 'ភ្នំពេញ',
      },
      createdAt: new Date().toISOString(),
    };

    const demoOrders: Order[] = [
      {
        id: 'KT00001',
        userId: 'usr_demo_1',
        customerName: 'សុខ សុវណ្ណ',
        customerPhone: '012 345 678',
        customerEmail: 'soksouvann@gmail.com',
        shippingAddress: '#123 ផ្លូវ 271, ទួលគោក, ភ្នំពេញ',
        paymentMethod: 'khqr',
        paymentStatus: 'paid',
        items: [
          {
            productId: 1,
            name: 'ASUS Vivobook 15 OLED',
            price: 749,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=450&fit=crop&auto=format',
          },
        ],
        subtotal: 749,
        shippingFee: 0,
        discount: 0,
        total: 749,
        status: 'delivered',
        statusTextKh: 'បានដឹកដល់',
        createdAt: '2024-01-15T10:30:00.000Z',
        timeline: [
          { title: 'បានបញ្ជាទិញ', time: '15 មករា 2024, 10:30 ព្រឹក', description: 'ការបញ្ជាទិញត្រូវបានបង្កើតជោគជ័យ', completed: true },
          { title: 'បានបញ្ជាក់ការទូទាត់', time: '15 មករា 2024, 10:35 ព្រឹក', description: 'បានទូទាត់តាមរយៈ KHQR', completed: true },
          { title: 'កំពុងរៀបចំទំនិញ', time: '15 មករា 2024, 02:00 រសៀល', description: 'ទំនិញកំពុងវេចខ្ចប់នៅឃ្លាំងភ្នំពេញ', completed: true },
          { title: 'បានដឹកដល់', time: '16 មករា 2024, 09:15 ព្រឹក', description: 'ទំនិញត្រូវបានប្រគល់ជូនអតិថិជនជោគជ័យ', completed: true },
        ],
      },
      {
        id: 'KT00002',
        userId: 'usr_demo_1',
        customerName: 'សុខ សុវណ្ណ',
        customerPhone: '012 345 678',
        customerEmail: 'soksouvann@gmail.com',
        shippingAddress: '#123 ផ្លូវ 271, ទួលគោក, ភ្នំពេញ',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        items: [
          {
            productId: 4,
            name: 'Logitech MX Master 3S',
            price: 89,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=450&fit=crop&auto=format',
          },
        ],
        subtotal: 89,
        shippingFee: 1.5,
        discount: 0,
        total: 90.5,
        status: 'shipped',
        statusTextKh: 'កំពុងដឹកជញ្ជូន',
        createdAt: '2024-01-20T14:20:00.000Z',
        timeline: [
          { title: 'បានបញ្ជាទិញ', time: '20 មករា 2024, 02:20 រសៀល', description: 'ការបញ្ជាទិញត្រូវបានបង្កើតជោគជ័យ', completed: true },
          { title: 'កំពុងរៀបចំទំនិញ', time: '20 មករា 2024, 03:00 រសៀល', description: 'ទំនិញត្រូវបានវេចខ្ចប់រួចរាល់', completed: true },
          { title: 'កំពុងដឹកជញ្ជូន', time: '21 មករា 2024, 08:30 ព្រឹក', description: 'អ្នកដឹកកំពុងធ្វើដំណើរទៅកាន់ទីតាំងរបស់អ្នក', completed: true },
          { title: 'បានដឹកដល់', time: 'រង់ចាំ...', description: 'រង់ចាំការប្រគល់ទំនិញ', completed: false },
        ],
      },
      {
        id: 'KT00003',
        userId: 'usr_demo_1',
        customerName: 'សុខ សុវណ្ណ',
        customerPhone: '012 345 678',
        customerEmail: 'soksouvann@gmail.com',
        shippingAddress: '#123 ផ្លូវ 271, ទួលគោក, ភ្នំពេញ',
        paymentMethod: 'khqr',
        paymentStatus: 'paid',
        items: [
          {
            productId: 2,
            name: 'Samsung Galaxy S24 Ultra',
            price: 1199,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=450&fit=crop&auto=format',
          },
        ],
        subtotal: 1199,
        shippingFee: 0,
        discount: 0,
        total: 1199,
        status: 'processing',
        statusTextKh: 'កំពុងដំណើរការ',
        createdAt: '2024-01-22T08:15:00.000Z',
        timeline: [
          { title: 'បានបញ្ជាទិញ', time: '22 មករា 2024, 08:15 ព្រឹក', description: 'ការបញ្ជាទិញត្រូវបានបង្កើតជោគជ័យ', completed: true },
          { title: 'បានបញ្ជាក់ការទូទាត់', time: '22 មករា 2024, 08:16 ព្រឹក', description: 'បានទូទាត់តាមរយៈ KHQR', completed: true },
          { title: 'កំពុងរៀបចំទំនិញ', time: 'កំពុងដំណើរការ...', description: 'ក្រុមការងារកំពុងត្រួតពិនិត្យ និងរៀបចំទំនិញ', completed: true },
          { title: 'កំពុងដឹកជញ្ជូន', time: 'រង់ចាំ...', description: 'រង់ចាំការប្រគល់ជូនអ្នកដឹក', completed: false },
          { title: 'បានដឹកដល់', time: 'រង់ចាំ...', description: 'រង់ចាំការប្រគល់ទំនិញ', completed: false },
        ],
      },
    ];

    this.data = {
      products: initialProducts,
      users: [demoUser],
      orders: demoOrders,
      contactMessages: [],
    };

    this.save();
  }

  private isSaving = false;
  private needsSaveAgain = false;
  private saveTimeout: NodeJS.Timeout | null = null;

  public saveSync() {
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to sync save db.json:', err);
    }
  }

  private save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.flushSaveAsync();
    }, 50);
  }

  private async flushSaveAsync() {
    if (this.isSaving) {
      this.needsSaveAgain = true;
      return;
    }
    this.isSaving = true;
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const payload = JSON.stringify(this.data, null, 2);
      await fs.promises.writeFile(tempFile, payload, 'utf-8');
      await fs.promises.rename(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to async save db.json:', err);
    } finally {
      this.isSaving = false;
      if (this.needsSaveAgain) {
        this.needsSaveAgain = false;
        this.save();
      }
    }
  }

  // Product operations
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: number): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  // User operations
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    const clean = email.trim().toLowerCase();
    return this.data.users.find(u => u.email.toLowerCase() === clean || u.phone === email.trim());
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = {
      ...this.data.users[index],
      ...updates,
    };
    this.save();
    return this.data.users[index];
  }

  deleteUser(id: string): boolean {
    const prevLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (this.data.users.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Order operations
  getOrders(): Order[] {
    return this.data.orders;
  }

  updateOrderStatus(orderId: string, status: Order['status'], customNote?: string): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.status = status;
    const now = new Date();
    const timeStr = `${now.toLocaleDateString('km-KH', { dateStyle: 'medium' })}, ${now.toLocaleTimeString('km-KH', { timeStyle: 'short' })}`;

    if (status === 'pending') {
      order.statusTextKh = 'កំពុងរង់ចាំការបញ្ជាក់';
    } else if (status === 'processing') {
      order.statusTextKh = 'កំពុងរៀបចំទំនិញ';
      if (order.timeline[1]) {
        order.timeline[1].completed = true;
        order.timeline[1].time = timeStr;
      }
    } else if (status === 'shipped') {
      order.statusTextKh = 'កំពុងដឹកជញ្ជូន';
      if (order.timeline[1]) order.timeline[1].completed = true;
      if (order.timeline[2]) {
        order.timeline[2].completed = true;
        order.timeline[2].time = timeStr;
      }
    } else if (status === 'delivered') {
      order.statusTextKh = 'បានដឹកដល់';
      order.paymentStatus = 'paid';
      order.timeline.forEach(t => (t.completed = true));
      if (order.timeline[3]) {
        order.timeline[3].time = timeStr;
      }
    } else if (status === 'cancelled') {
      order.statusTextKh = 'បានលុបចោល';
      order.timeline.push({
        title: 'បានលុបចោលការបញ្ជាទិញ',
        time: timeStr,
        description: customNote || 'ការបញ្ជាទិញត្រូវបានលុបចោលដោយ Admin',
        completed: true,
      });
    }

    this.save();
    return order;
  }

  getUserOrders(userId: string): Order[] {
    return this.data.orders.filter(o => o.userId === userId);
  }

  getOrderById(id: string): Order | undefined {
    const cleanId = id.trim().toUpperCase();
    return this.data.orders.find(o => o.id.toUpperCase() === cleanId);
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'status' | 'statusTextKh'> & { status?: Order['status'] }): Order {
    const nextNum = (this.data.orders.length + 101).toString().padStart(5, '0');
    const orderId = `KT${nextNum}`;
    const now = new Date();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: orderData.status || 'pending',
      statusTextKh: 'កំពុងរង់ចាំការបញ្ជាក់',
      createdAt: now.toISOString(),
      timeline: [
        {
          title: 'បានបញ្ជាទិញ',
          time: `${now.toLocaleDateString('km-KH', { dateStyle: 'medium' })}, ${now.toLocaleTimeString('km-KH', { timeStyle: 'short' })}`,
          description: 'ការបញ្ជាទិញត្រូវបានបង្កើតជោគជ័យ',
          completed: true,
        },
        {
          title: 'កំពុងរៀបចំទំនិញ',
          time: 'កំពុងដំណើរការ...',
          description: 'ក្រុមការងារកំពុងត្រួតពិនិត្យ និងរៀបចំទំនិញ',
          completed: false,
        },
        {
          title: 'កំពុងដឹកជញ្ជូន',
          time: 'រង់ចាំ...',
          description: 'រង់ចាំការប្រគល់ជូនអ្នកដឹក',
          completed: false,
        },
        {
          title: 'បានដឹកដល់',
          time: 'រង់ចាំ...',
          description: 'រង់ចាំការប្រគល់ទំនិញជូនលោកអ្នក',
          completed: false,
        },
      ],
    };

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  // Contact message operations
  createContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.contactMessages.unshift(newMsg);
    this.save();
    return newMsg;
  }
}

export const db = new JSONDatabase();
