//insert all columns in regards to table from supabase here. along side the db.ts file

export interface PageMeta {
  title: string
  description: string
  cardImage: string
  url: string
  robots?: string
  favicon?: string
  type?: string
}

export interface User {
  created_at: string | null
  email: string | null | undefined
  email_verified: string | null
  id: string
  image: string | null
  name: string | null
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  stripe_current_period_end: string | null
  stripe_customer_id: string | null
  stripe_price_id: string | null
  stripe_subscription_id: string | null
  updated_at: string | null
}

export interface Post {
  id: string /* primary key */
  title: string
  content: JSON | null
  published: boolean
  created_at: string
  updated_at: string
  author_id: string
}

export interface AllFileUploads {
  id: string /* primary key */
  user_id: string
  company_id: string
  lot_number: string
  project_name: string
  file_name: string
  date_added: string
  due_date: string
  assigned_user: string | null
  assigned_user_id: string | null
  comment: string | null
  file_path: string | null
  status: string
  drawing_scale: string | null
}
