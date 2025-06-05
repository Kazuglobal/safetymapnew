-- Initial schema for Culture Bridge Program 2025

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'international_student', 'admin');
CREATE TYPE group_status AS ENUM ('active', 'inactive', 'completed');
CREATE TYPE work_status AS ENUM ('pending', 'submitted', 'reviewed', 'completed');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    school_name TEXT,
    grade TEXT,
    country TEXT, -- For international students
    introduction TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    international_student_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status group_status DEFAULT 'active',
    max_members INTEGER DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members junction table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    resource_type TEXT NOT NULL, -- 'article', 'video', 'document', etc.
    url TEXT,
    file_path TEXT,
    tags TEXT[],
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Works table (assignments/activities)
CREATE TABLE works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 4),
    instructions TEXT,
    submission_format TEXT[], -- 'text', 'image', 'video', 'file'
    due_date TIMESTAMP WITH TIME ZONE,
    max_score INTEGER DEFAULT 100,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work submissions table
CREATE TABLE work_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    content TEXT,
    file_paths TEXT[],
    status work_status DEFAULT 'pending',
    score INTEGER,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(work_id, user_id)
);

-- Feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES work_submissions(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    score INTEGER,
    suggestions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for chat functionality
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    status work_status DEFAULT 'pending',
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, work_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_work_submissions_work_id ON work_submissions(work_id);
CREATE INDEX idx_work_submissions_user_id ON work_submissions(user_id);
CREATE INDEX idx_messages_group_id ON messages(group_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR ALL USING (auth_id = auth.uid());

CREATE POLICY "Users can view other users in their groups" ON users
    FOR SELECT USING (
        id IN (
            SELECT u.id FROM users u
            JOIN group_members gm1 ON u.id = gm1.user_id
            JOIN group_members gm2 ON gm1.group_id = gm2.group_id
            WHERE gm2.user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
        )
    );

CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- Groups policies
CREATE POLICY "Users can view groups they belong to" ON groups
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
        )
    );

CREATE POLICY "International students can update their groups" ON groups
    FOR UPDATE USING (
        international_student_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    );

CREATE POLICY "Admins can manage all groups" ON groups
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- Group members policies
CREATE POLICY "Users can view group members of their groups" ON group_members
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
        )
    );

-- Work submissions policies
CREATE POLICY "Users can view their own submissions" ON work_submissions
    FOR ALL USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "International students can view submissions of their group members" ON work_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM groups g
            JOIN group_members gm ON g.id = gm.group_id
            WHERE g.international_student_id = (SELECT id FROM users WHERE auth_id = auth.uid())
            AND gm.user_id = work_submissions.user_id
        )
    );

-- Messages policies
CREATE POLICY "Users can view messages in their groups" ON messages
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages to their groups" ON messages
    FOR INSERT WITH CHECK (
        sender_id = (SELECT id FROM users WHERE auth_id = auth.uid())
        AND group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial works for the 4-day program
INSERT INTO works (title, description, day_number, instructions, submission_format) VALUES
('Day 1: Cultural Introduction', 'Create a presentation introducing your culture and background', 1, 'Prepare a 3-5 minute presentation about your country, culture, and personal background. Include photos, traditions, and interesting facts.', ARRAY['text', 'image', 'video']),
('Day 1: Goal Setting', 'Set your learning goals for this program', 1, 'Write down 3-5 specific goals you want to achieve during this program. Be specific and measurable.', ARRAY['text']),
('Day 2: Cultural Exchange Activity', 'Participate in cultural exchange with your international student partner', 2, 'Work with your assigned international student to complete a cultural comparison activity. Discuss similarities and differences between your cultures.', ARRAY['text', 'image']),
('Day 2: Language Practice', 'Practice English conversation with your partner', 2, 'Record a 5-minute conversation in English with your international student partner on a topic of your choice.', ARRAY['video']),
('Day 3: Global Issues Research', 'Research a global issue and present solutions', 3, 'Choose a global issue (climate change, poverty, education, etc.) and research it with your group. Prepare a presentation with proposed solutions.', ARRAY['text', 'image', 'file']),
('Day 3: Cross-Cultural Communication', 'Practice cross-cultural communication skills', 3, 'Complete exercises on effective cross-cultural communication and write a reflection on what you learned.', ARRAY['text']),
('Day 4: Final Presentation', 'Create and deliver your final presentation', 4, 'Prepare a comprehensive presentation showcasing everything you learned during the program. Include cultural insights, language improvements, and future goals.', ARRAY['text', 'image', 'video']),
('Day 4: Program Reflection', 'Reflect on your learning experience', 4, 'Write a detailed reflection on your experience in the program. What did you learn? How did you grow? What are your next steps?', ARRAY['text']);