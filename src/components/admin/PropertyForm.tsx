"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import styles from "./propertyForm.module.css";

const typeValues = ["APARTMENT", "VILLA", "PENTHOUSE", "DUPLEX", "LAND"] as const;
const featurePresets = [
  "Deniz manzarası",
  "Bahçe",
  "Oyun parkı",
  "Havuz",
  "Kapalı otopark",
  "Açık otopark",
  "Güvenlik",
  "Kamera sistemi",
  "Kreş/çocuk alanı",
  "Spor salonu",
  "Sauna",
  "Fitness merkezi",
  "Jakuzi",
  "Şömine",
  "Teras",
  "Asansör",
  "Akıllı ev",
  "Concierge",
  "Jeneratör altyapısı",
  "Yangın güvenliği",
  "Ebeveyn banyosu",
  "Giyinme odası",
] as const;

const schema = z.object({
  title: z.string().min(3, "Başlık çok kısa"),
  description: z.string().min(10, "Açıklama çok kısa"),
  price: z.number().int().positive("Fiyat geçersiz"),
  location: z.string().min(2, "Lokasyon çok kısa"),
  type: z.enum(typeValues),
  features: z.array(z.string().min(1)),
});

export type PropertyFormValues = z.infer<typeof schema>;

export type PropertyImageDTO = {
  id: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
};

export function PropertyForm({
  mode,
  onSubmitSuccess,
  initial,
  submitLabel,
  apiUrl,
  method,
}: {
  mode: "create" | "edit";
  onSubmitSuccess: () => void;
  initial?: {
    title: string;
    description: string;
    price: number;
    location: string;
    type: (typeof typeValues)[number];
    features: string[];
    images?: PropertyImageDTO[];
  };
  submitLabel: string;
  apiUrl: string;
  method: "POST" | "PUT";
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [featuresInput, setFeaturesInput] = useState("");

  const defaultValues = useMemo<PropertyFormValues>(
    () => ({
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      price: initial?.price || ("" as unknown as number),
      location: initial?.location ?? "",
      type: initial?.type ?? "APARTMENT",
      features: initial?.features ?? [],
    }),
    [initial],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });

  // `watch()` React Compiler ile güvenli şekilde memoize edilemediği için `useWatch` kullanıyoruz.
  const features = useWatch({ control, name: "features" });

  async function submit(values: PropertyFormValues) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("location", values.location);
    formData.append("type", values.type);
    formData.append("features", JSON.stringify(values.features ?? []));

    for (const file of selectedFiles) formData.append("images", file);

    const res = await fetch(apiUrl, {
      method,
      body: formData,
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? "Kaydetme başarısız");
      return;
    }
    onSubmitSuccess();
  }

  function addFeature() {
    const v = featuresInput.trim();
    addFeatureValue(v);
    setFeaturesInput("");
  }

  function addFeatureValue(value: string) {
    const v = value.trim();
    if (!v) return;
    const has = (features ?? []).includes(v);
    if (has) return;
    const next = Array.from(new Set([...(features ?? []), v]));
    setValue("features", next, { shouldDirty: true, shouldValidate: false });
  }

  function removeFeature(feature: string) {
    setValue(
      "features",
      (features ?? []).filter((f) => f !== feature),
      { shouldDirty: true, shouldValidate: false },
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <div className={styles.grid}>
        <label className={styles.label}>
          Başlık
          <input className={styles.input} {...register("title")} placeholder="Örn: Boğaz Manzaralı Daire" />
          {errors.title ? <span className={styles.err}>{errors.title.message}</span> : null}
        </label>

        <label className={styles.label}>
          Lokasyon
          <input className={styles.input} {...register("location")} placeholder="Örn: Beşiktaş / İstanbul" />
          {errors.location ? <span className={styles.err}>{errors.location.message}</span> : null}
        </label>

        <label className={styles.label}>
          Tür
          <select className={styles.input} {...register("type")}>
            {typeValues.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.type ? <span className={styles.err}>{errors.type.message}</span> : null}
        </label>

        <label className={styles.label}>
          Fiyat (TL)
          <input
            className={styles.input}
            {...register("price", { valueAsNumber: true })}
            type="number"
            placeholder="Örn: 12500000"
            min={1}
          />
          {errors.price ? <span className={styles.err}>{errors.price.message}</span> : null}
        </label>
      </div>

      <label className={styles.label}>
        Açıklama
        <textarea
          className={styles.textarea}
          {...register("description")}
          placeholder="Konumu, yaşam tarzı ve öne çıkan detayları anlatın..."
        />
        {errors.description ? <span className={styles.err}>{errors.description.message}</span> : null}
      </label>

      <div className={styles.features}>
        <div className={styles.sectionTitle}>Özellikler</div>

        <div className={styles.featureAdd}>
          <input
            className={styles.featureInput}
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            placeholder="Örn: Deniz manzarası"
          />
          <button type="button" className={`${styles.smallBtn} lift focus-ring`} onClick={addFeature}>
            Ekle
          </button>
        </div>

        <div className={styles.presets}>
          <div className={styles.presetsTitle}>Hızlı seçim</div>
          <div className={styles.presetGrid}>
            {featurePresets.map((preset) => {
              const active = (features ?? []).includes(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => addFeatureValue(preset)}
                  disabled={active}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {features?.length ? (
          <div className={styles.chips}>
            {features.map((f) => (
              <button
                key={f}
                type="button"
                className={styles.chip}
                onClick={() => removeFeature(f)}
                aria-label={`${f} özelliğini kaldır`}
              >
                {f} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.emptyFeatures}>Özellik ekleyin (opsiyonel).</div>
        )}
      </div>

      <div className={styles.gallery}>
        <div className={styles.sectionTitle}>Galerİ</div>

        {mode === "edit" && initial?.images?.length ? (
          <div className={styles.existingBlock}>
            <div className={styles.muted}>
              Mevcut görseller: yeni görsel seçerseniz galeri yenilenecek.
            </div>
            <div className={styles.galleryGrid}>
              {initial.images
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((img) => (
                  <div key={img.id} className={styles.thumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.altText ?? "Özellik görseli"} />
                  </div>
                ))}
            </div>
          </div>
        ) : null}

        <label className={styles.label}>
          {mode === "create" ? "Görselleri yükleyin" : "Yeni görseller (opsiyonel)"}
          <input
            className={styles.file}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setSelectedFiles(files);
            }}
          />
        </label>

        {selectedFiles.length ? (
          <div className={styles.newBlock}>
            <div className={styles.muted}>Seçilen yeni görseller:</div>
            <div className={styles.galleryGrid}>
              {selectedFiles.map((file) => (
                <div key={file.name + file.size} className={styles.thumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt={file.name} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

