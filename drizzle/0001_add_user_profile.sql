CREATE TABLE IF NOT EXISTS "userProfile" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "userProfile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"clerkId" varchar(255) NOT NULL UNIQUE,
	"dateOfBirth" varchar(50),
	"gender" varchar(20),
	"conditions" json,
	"allergies" json,
	"height" varchar(20),
	"weight" varchar(20),
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userProfile_clerkId_users_clerkId_fk" FOREIGN KEY ("clerkId") REFERENCES "users"("clerkId") ON DELETE NO ACTION ON UPDATE NO ACTION
);
