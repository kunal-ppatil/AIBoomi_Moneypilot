-- MoneyPilot Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create financial_plans table
CREATE TABLE IF NOT EXISTS public.financial_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    personal JSONB NOT NULL,
    goals JSONB NOT NULL,
    preferences JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create calculation_results table
CREATE TABLE IF NOT EXISTS public.calculation_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.financial_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculation_results ENABLE ROW LEVEL SECURITY;

-- Create policies for financial_plans
CREATE POLICY "Users can view their own financial plans"
    ON public.financial_plans
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own financial plans"
    ON public.financial_plans
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial plans"
    ON public.financial_plans
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial plans"
    ON public.financial_plans
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for calculation_results
CREATE POLICY "Users can view their own calculation results"
    ON public.calculation_results
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculation results"
    ON public.calculation_results
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calculation results"
    ON public.calculation_results
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculation results"
    ON public.calculation_results
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_financial_plans_user_id ON public.financial_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_calculation_results_user_id ON public.calculation_results(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_financial_plans_updated_at
    BEFORE UPDATE ON public.financial_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculation_results_updated_at
    BEFORE UPDATE ON public.calculation_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
