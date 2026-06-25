import { supabase } from "./supabase";

export async function getBusinessProfile(userId: string) {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { data, error };
}

export async function saveBusinessProfile(profile: any) {
  const { data, error } = await supabase
    .from("business_profiles")
    .upsert(profile, {
      onConflict: "user_id",
    })
    .select()
    .single();

  return { data, error };
}

export async function uploadBusinessFile(
  file: File,
  userId: string,
  folder: "logo" | "signature"
) {
  const ext = file.name.split(".").pop();

  const fileName = `${userId}/${folder}.${ext}`;

  const bucket = folder === "logo" ? "logos" : "signatures";

const { error } = await supabase.storage
  .from(bucket)
  .upload(fileName, file, {
    upsert: true,
  });

if (error) {
  return { url: null, error };
}

const { data } = supabase.storage
  .from(bucket)
  .getPublicUrl(fileName);
  return {
    url: data.publicUrl,
    error: null,
  };
}