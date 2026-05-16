"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

export interface FavouriteProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  stock: number;
  in_stock: boolean;
  category: string;
  image_url?: string | null;
}

interface FavouritesContextType {
  favourites: FavouriteProduct[];
  toggle: (product: FavouriteProduct) => void;
  isFavourite: (id: string) => boolean;
  count: number;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<FavouriteProduct[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("favourites");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const toggle = (product: FavouriteProduct) => {
    setFavourites(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isFavourite = (id: string) => favourites.some(p => p.id === id);

  return (
    <FavouritesContext.Provider value={{ favourites, toggle, isFavourite, count: favourites.length }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
}
