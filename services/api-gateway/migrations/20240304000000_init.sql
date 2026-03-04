-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    template TEXT NOT NULL,
    main_chain TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create builds table
CREATE TABLE IF NOT EXISTS builds (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    status TEXT NOT NULL, -- pending, compiling, completed, failed
    targets TEXT[] NOT NULL,
    logs TEXT[] DEFAULT ARRAY[]::TEXT[],
    artifacts JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for project lookups
CREATE INDEX IF NOT EXISTS idx_builds_project_id ON builds(project_id);
