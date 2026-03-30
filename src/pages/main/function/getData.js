import { supabase } from "@/providers/supabase";

function formatDate(dateString) {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric", 
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(date).replace(",", "");
}

export const getData = async () => {
  const { data, error } = await supabase
    .from("nec-transmitter")
    .select("*");

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data.map((item) => ({
    ...item,
    created_at_label: formatDate(item.created_at), // hanya untuk display
  }));
};

export const getLastData = async () => {
  const { data, error } = await supabase
    .from("nec-transmitter")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return {
    ...data,
    created_at_label: formatDate(data.created_at),
  };
};