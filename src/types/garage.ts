export enum Role {
  ADMIN = 'ADMIN',
  MECHANIC = 'MECHANIC',
  CLIENT = 'CLIENT'
}

export enum WorkOrderStatus {
  PENDING_APPROVAL = 'pending_approval',
  IN_PROGRESS = 'in_progress',
  WAITING_PARTS = 'waiting_parts',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_SERVICE = 'IN_SERVICE',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP'
}

export interface User {
  id: number
  email: string
  name: string
  role: Role
  phone?: string
  isEmailConfirmed?: boolean
  isLocked?: boolean
}

export interface Vehicle {
  id: number
  brand: string
  model: string
  year: number
  licensePlate: string
  color?: string
  status: VehicleStatus
  userId: number
  client?: {
    name: string
    email: string
  }
}

export interface WorkOrderItem {
  id?: number
  name: string
  type: 'spare_part' | 'service'
  quantity: number
  unitPrice: number
  approved?: boolean
}

export interface WorkOrder {
  id: number
  licensePlate: string
  description: string
  estimatedCost: number
  status: WorkOrderStatus
  items: WorkOrderItem[]
  createdAt: string
  updatedAt: string
  mechanicId?: number
  vehicle?: Vehicle
}

export interface Appointment {
  id: number
  date: string
  status: 'pending' | 'accepted' | 'rejected'
  mechanicId: number
  vehicleId: number
  vehicle?: Vehicle
  mechanic?: User
  client?: {
    name: string
    email: string
  }
  description?: string
  time?: string
  rejectionReason?: string
}

export interface NotificationPayload {
  id?: number
  title: string
  message: string
  type: string
  read?: boolean
  createdAt?: string
  metadata?: Record<string, unknown>
}

export interface Schedule {
  id: number
  mechanicId: number
  date: string
  availableHours: string[]
  mechanic: {
    id: number
    name: string
  }
}

export interface ScheduleResponse {
  data: Schedule[]
}

export interface LoginResponse {
  access_token: string
  user: User
}
