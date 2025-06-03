
-- SIWES Management System Database Schema
-- For Abraham Adesanya Polytechnic

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (main authentication table)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'supervisor', 'coordinator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    matric_number VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    level VARCHAR(10) DEFAULT '200',
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'verified')),
    payment_amount DECIMAL(10,2) DEFAULT 7000.00,
    
    -- Organization details
    organization_name VARCHAR(255),
    organization_address TEXT,
    organization_state VARCHAR(50),
    organization_lga VARCHAR(100),
    organization_contact_person VARCHAR(255),
    organization_contact_phone VARCHAR(20),
    organization_contact_email VARCHAR(255),
    organization_contact_position VARCHAR(100),
    
    -- SIWES period
    siwes_start_date DATE,
    siwes_end_date DATE,
    
    -- Supervisor assignment
    supervisor_id UUID REFERENCES users(id),
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'suspended')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supervisors table
CREATE TABLE supervisors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    specialization VARCHAR(255),
    max_students INTEGER DEFAULT 20,
    current_students INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coordinators table
CREATE TABLE coordinators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    office_location VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    activities_performed TEXT,
    skills_acquired TEXT,
    challenges_faced TEXT,
    
    -- File attachments
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    
    -- Feedback and grading
    supervisor_feedback TEXT,
    coordinator_feedback TEXT,
    grade VARCHAR(5),
    
    -- Status and dates
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved', 'rejected')),
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    review_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, week_number)
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_gateway VARCHAR(50),
    gateway_reference VARCHAR(255),
    
    -- Payment status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'verified')),
    
    -- Evidence and verification
    evidence_url VARCHAR(500),
    verified_by UUID REFERENCES users(id),
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat/Messages table
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
    
    -- File attachments for messages
    attachment_url VARCHAR(500),
    attachment_name VARCHAR(255),
    attachment_size INTEGER,
    
    -- Message status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations table (for better organization management)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    state VARCHAR(50) NOT NULL,
    lga VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    contact_position VARCHAR(100),
    industry_type VARCHAR(100),
    organization_size VARCHAR(50),
    
    -- Approval status
    approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES users(id),
    approval_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student organization assignments (many-to-many relationship)
CREATE TABLE student_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    assignment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, organization_id)
);

-- Supervisor assignments table (for tracking assignment history)
CREATE TABLE supervisor_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supervisor_id UUID REFERENCES supervisors(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assignment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'transferred')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SIWES letters/documents table
CREATE TABLE siwes_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    generated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    downloaded_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_students_matric_number ON students(matric_number);
CREATE INDEX idx_students_supervisor_id ON students(supervisor_id);
CREATE INDEX idx_students_organization ON students(organization_name);
CREATE INDEX idx_reports_student_id ON reports(student_id);
CREATE INDEX idx_reports_week_number ON reports(week_number);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_chats_sender_receiver ON chats(sender_id, receiver_id);
CREATE INDEX idx_chats_timestamp ON chats(timestamp);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('siwes_fee', '7000.00', 'SIWES registration fee in Naira'),
('max_students_per_supervisor', '20', 'Maximum number of students per supervisor'),
('report_submission_weeks', '12', 'Total number of weeks for report submission'),
('academic_session', '2023/2024', 'Current academic session'),
('siwes_duration_weeks', '24', 'SIWES duration in weeks');

-- Insert default admin/coordinator user
INSERT INTO users (name, email, password, role) VALUES 
('Prof. Adebisi Johnson', 'coordinator@aapoly.edu.ng', 'coordinator123', 'coordinator');

-- Insert default supervisor
INSERT INTO users (name, email, password, role) VALUES 
('Dr. Oluwaseun Olamide', 'supervisor@aapoly.edu.ng', 'supervisor123', 'supervisor');

-- Insert default student
INSERT INTO users (name, email, password, role) VALUES 
('John Adebayo', 'student@aapoly.edu.ng', 'student123', 'student');

-- Insert coordinator profile
INSERT INTO coordinators (user_id, department, phone_number, office_location)
SELECT id, 'Computer Science', '08012345678', 'Admin Block, Room 201'
FROM users WHERE email = 'coordinator@aapoly.edu.ng';

-- Insert supervisor profile
INSERT INTO supervisors (user_id, department, phone_number, specialization)
SELECT id, 'Computer Science', '08087654321', 'Software Development & Database Systems'
FROM users WHERE email = 'supervisor@aapoly.edu.ng';

-- Insert student profile
INSERT INTO students (user_id, matric_number, department, level)
SELECT id, '22-04-0191', 'Computer Science', '200'
FROM users WHERE email = 'student@aapoly.edu.ng';

-- Functions and triggers for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supervisors_updated_at BEFORE UPDATE ON supervisors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coordinators_updated_at BEFORE UPDATE ON coordinators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update supervisor student count
CREATE OR REPLACE FUNCTION update_supervisor_student_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE supervisors 
        SET current_students = (
            SELECT COUNT(*) 
            FROM students 
            WHERE supervisor_id = NEW.supervisor_id AND status = 'active'
        )
        WHERE user_id = NEW.supervisor_id;
    END IF;
    
    IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
        UPDATE supervisors 
        SET current_students = (
            SELECT COUNT(*) 
            FROM students 
            WHERE supervisor_id = OLD.supervisor_id AND status = 'active'
        )
        WHERE user_id = OLD.supervisor_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Add trigger for supervisor student count
CREATE TRIGGER update_supervisor_count_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON students 
    FOR EACH ROW EXECUTE FUNCTION update_supervisor_student_count();
