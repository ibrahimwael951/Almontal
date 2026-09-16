import type { ProductFormValues } from "@/components/products/ProductFormFields";

export function buildProductFormData(form: ProductFormValues): FormData {
  const fd = new FormData();

  fd.append("Name", form.name);
  fd.append("NameAr", form.nameAr);
  fd.append("Price", String(form.price));
  fd.append("OriginalPrice", String(form.originalPrice));
  fd.append("UnitType", form.unitType);
  fd.append("SurfaceType", form.surfaceType);
  fd.append("CategoryId", form.categoryId);
  fd.append("CategoryName", form.categoryName);
  fd.append("CategoryNameAr", form.categoryNameAr);
  fd.append("Material", form.material);
  fd.append("MaterialAr", form.materialAr);
  fd.append("Finish", form.finish);
  fd.append("FinishAr", form.finishAr);
  fd.append("Color", form.color);
  fd.append("ColorAr", form.colorAr);
  fd.append("ColorHex", form.colorHex);
  fd.append("Thickness", form.thickness);
  fd.append("OriginCountry", form.originCountry);
  fd.append("OriginCountryAr", form.originCountryAr);
  fd.append("ShortDescription", form.shortDescription);
  fd.append("ShortDescriptionAr", form.shortDescriptionAr);
  fd.append("Description", form.description);
  fd.append("DescriptionAr", form.descriptionAr);
  fd.append("Badge", form.badge);
  fd.append("BadgeAr", form.badgeAr);
  fd.append("IsFeatured", String(form.isFeatured));
  fd.append("IsBestSeller", String(form.isBestSeller));
  fd.append("InStock", String(form.inStock));

  form.featuresText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((f) => fd.append("Features", f));

  form.featuresArText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((f) => fd.append("FeaturesAr", f));

  const [main, ...rest] = form.images;
  if (main) {
    if (main.kind === "file" && main.file) {
      fd.append("ImageFile", main.file);
    } else if (main.kind === "url" && main.url) {
      fd.append("ImageUrl", main.url);
    }
  }

  rest.forEach((entry) => {
    if (entry.kind === "file" && entry.file) {
      fd.append("GalleryFiles", entry.file);
    } else if (entry.kind === "url" && entry.url) {
      fd.append("Gallery", entry.url);
    }
  });

  if (form.video) {
    if (form.video.kind === "file" && form.video.file) {
      fd.append("VideoFile", form.video.file);
    } else if (form.video.kind === "url" && form.video.url) {
      fd.append("VideoUrl", form.video.url);
    }
  }

  return fd;
}
