/*
  Warnings:

  - You are about to drop the column `municipal` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `municipality` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "imported" SET DEFAULT false,
ALTER COLUMN "selling_price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "municipal",
ADD COLUMN     "municipality" TEXT NOT NULL;
