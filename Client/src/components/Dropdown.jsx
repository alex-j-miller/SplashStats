import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Dropdown({ label, options, defaultOption, onSelect }) {
  const [value, setValue] = useState(options[0].name);

  // useEffect(() => {
  //   setValue(options[0].name);
  // }, [options]);

  const handleChange = (event) => {
    setValue(event.target.value);
    onSelect(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select value={value} label={label} onChange={handleChange}>
          {options.map((opt) => (
            <MenuItem value={opt.name}>{opt.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
