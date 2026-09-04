-- CreateTable
CREATE TABLE "Launch" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "director" TEXT,
    "releaseLabel" TEXT NOT NULL,
    "bannerUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Launch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Launch_active_idx" ON "Launch"("active");
