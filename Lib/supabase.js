import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dacnrqyqerpsbwavmuiq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhY25ycXlxZXJwc2J3YXZtdWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NzA1MDUsImV4cCI6MjA2MzE0NjUwNX0.78N2z6tKR6oIBfepxmZjxGXW032SsxBnDODgyhyaJ2k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)