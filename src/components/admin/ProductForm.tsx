"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { addProduct } from "@/app/_actions/product"; // Ensure this path matches where you put the action

export default function ProductForm() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form action={addProduct} className="space-y-8">
      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label>Product Image</Label>
        <div className="flex items-center gap-4">
          {imageUrl ? (
            <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 h-6 w-6"
                onClick={() => setImageUrl("")}
              >
                <X className="h-4 w-4" />
              </Button>
              <Image 
                src={imageUrl} 
                alt="Product Image" 
                fill 
                className="object-cover" 
              />
            </div>
          ) : (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result: any) => {
                setImageUrl(result.info.secure_url);
              }}
            >
              {({ open }) => {
                return (
                  <div
                    onClick={() => open()}
                    className="flex flex-col items-center justify-center w-[200px] h-[200px] border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition"
                  >
                    <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Upload Image</span>
                  </div>
                );
              }}
            </CldUploadWidget>
          )}
          {/* Hidden input to send the URL to the server action */}
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" placeholder="e.g. Premium Cotton Shirt" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" name="price" type="number" step="0.01" placeholder="999" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            placeholder="Describe your product..." 
            className="h-32"
            required 
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
}