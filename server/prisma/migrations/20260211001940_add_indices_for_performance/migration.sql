-- CreateIndex
CREATE INDEX "peer_profiles_target_job_roles_idx" ON "peer_profiles" USING GIN ("target_job_roles");

-- CreateIndex
CREATE INDEX "peer_profiles_updated_at_idx" ON "peer_profiles"("updated_at");
