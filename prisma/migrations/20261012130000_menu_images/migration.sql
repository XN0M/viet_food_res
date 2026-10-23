CREATE TABLE "MenuImage" (
    "id" TEXT NOT NULL,
    "branchKey" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "localPath" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bytes" INTEGER NOT NULL,
    "menuItemIds" TEXT[],
    "sourceItems" JSONB NOT NULL,
    "reviewPending" BOOLEAN NOT NULL DEFAULT true,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MenuImage_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MenuImage_sourceUrl_key" ON "MenuImage"("sourceUrl");
CREATE INDEX "MenuImage_branchKey_idx" ON "MenuImage"("branchKey");
