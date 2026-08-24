import { createClient } from './client';

/**
 * Upload an image file to Supabase 'products' storage bucket
 * Returns the public URL of the uploaded image
 */
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
  const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading product image to Supabase Storage:', error);
    throw new Error(error.message || 'Failed to upload image to storage');
  }

  const { data: publicUrlData } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
