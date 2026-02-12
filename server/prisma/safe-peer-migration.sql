-- Safe migration: Create missing peer tables IF NOT EXISTS
-- This handles the case where the database already has some tables but not the peer network tables

-- Create ConnectionStatus enum if not exists
DO $$ BEGIN
    CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create peer_profiles table
CREATE TABLE IF NOT EXISTS "peer_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "target_job_roles" TEXT[],
    "placement_stage" TEXT NOT NULL,
    "headline" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "peer_profiles_pkey" PRIMARY KEY ("id")
);

-- Create peer_connections table
CREATE TABLE IF NOT EXISTS "peer_connections" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "peer_connections_pkey" PRIMARY KEY ("id")
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS "conversations" (
    "id" TEXT NOT NULL,
    "participant_one_id" TEXT NOT NULL,
    "participant_two_id" TEXT NOT NULL,
    "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- Create messages table
CREATE TABLE IF NOT EXISTS "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- Indexes (use IF NOT EXISTS where possible)
CREATE UNIQUE INDEX IF NOT EXISTS "peer_profiles_user_id_key" ON "peer_profiles"("user_id");
CREATE INDEX IF NOT EXISTS "peer_profiles_college_idx" ON "peer_profiles"("college");
CREATE INDEX IF NOT EXISTS "peer_profiles_target_job_roles_idx" ON "peer_profiles" USING GIN ("target_job_roles");
CREATE INDEX IF NOT EXISTS "peer_profiles_updated_at_idx" ON "peer_profiles"("updated_at");

CREATE INDEX IF NOT EXISTS "peer_connections_status_idx" ON "peer_connections"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "peer_connections_requester_id_receiver_id_key" ON "peer_connections"("requester_id", "receiver_id");

CREATE INDEX IF NOT EXISTS "conversations_last_message_at_idx" ON "conversations"("last_message_at");
CREATE UNIQUE INDEX IF NOT EXISTS "conversations_participant_one_id_participant_two_id_key" ON "conversations"("participant_one_id", "participant_two_id");

CREATE INDEX IF NOT EXISTS "messages_conversation_id_idx" ON "messages"("conversation_id");
CREATE INDEX IF NOT EXISTS "messages_created_at_idx" ON "messages"("created_at");

-- Foreign keys (safe: will error if already exists, wrapped in DO block)
DO $$ BEGIN
    ALTER TABLE "peer_profiles" ADD CONSTRAINT "peer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "peer_connections" ADD CONSTRAINT "peer_connections_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "peer_connections" ADD CONSTRAINT "peer_connections_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant_one_id_fkey" FOREIGN KEY ("participant_one_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant_two_id_fkey" FOREIGN KEY ("participant_two_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Mark Prisma migrations as applied so future migrations work correctly
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);

-- Insert migration records if not already present
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "applied_steps_count")
SELECT gen_random_uuid(), 'manual_baseline', now(), '20260211001235_init_peer_network', 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260211001235_init_peer_network');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "applied_steps_count")
SELECT gen_random_uuid(), 'manual_baseline', now(), '20260211001940_add_indices_for_performance', 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260211001940_add_indices_for_performance');
