import Button from "@mui/material/Button";

export default function DownloadButton({ variant, text }) {
  const downloadCSV = async () => {
    const response = await fetch("");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button variant={variant} style={{ margin: 5 }} onClick={downloadCSV}>
      {text}
    </Button>
  );
}
