export async function getForecastFromAPI(start_date: string, periods: number) {
    // Ensure format is "YYYY-MM-DD HH:mm:ss"
    const formattedDate = start_date.includes(":") ? start_date : `${start_date} 00:00:00`;
  
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ start_date: formattedDate, periods }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch forecast");
    }
  
    const data = await response.json();
    return data.forecast;
  }
