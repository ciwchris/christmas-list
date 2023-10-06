drop policy "Everyone can view items. " on "public"."items";

drop policy "Individuals can create items." on "public"."items";

drop policy "Individuals can delete their own items." on "public"."items";

drop policy "Individuals can update their own items." on "public"."items";

alter table "public"."items" add column "purchased_at" timestamp with time zone;

alter table "public"."items" add column "purchased_by_user_id" uuid;

alter table "public"."items" add constraint "items_purchased_by_user_id_fkey" FOREIGN KEY (purchased_by_user_id) REFERENCES auth.users(id) not valid;

alter table "public"."items" validate constraint "items_purchased_by_user_id_fkey";

create policy "Enable read access for all users"
on "public"."items"
as permissive
for select
to public
using (true);


create policy "Users can update their purchased items and unclaimed items"
on "public"."items"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM items i
  WHERE ((i.purchased_by_user_id = auth.uid()) OR (i.purchased_by_user_id IS NULL)))))
with check ((EXISTS ( SELECT 1
   FROM items i
  WHERE ((i.purchased_by_user_id = auth.uid()) OR (i.purchased_by_user_id IS NULL)))));



