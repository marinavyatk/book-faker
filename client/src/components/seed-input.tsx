import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {useEffect, useState} from "react";
import useDebounce from "../custom-hooks/use-debaunce.tsx";

type Props = {
    onSeedChange: (value: string) => void;
}
export const SeedInput = ({onSeedChange}: Props) => {
    const [seed, setSeed] = useState('0');
    const generateSeed = () => {
        const newSeed = Math.floor(Math.random() * 1e8).toString().padStart(8, '0');
        setSeed(newSeed);
    };

    const value = useDebounce(seed , 1000);

    useEffect(()=>{
        onSeedChange(value)
    }, [value])

    return <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor="seed">Seed</InputLabel>
        <OutlinedInput
            fullWidth
            id="seed"
            label="Seed"
            value={seed}
            onChange={e => setSeed(e.target.value)}
            type={'number'}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        onClick={generateSeed}
                    >
                        <AutorenewIcon/>
                    </IconButton>
                </InputAdornment>
            }
        />
    </FormControl>
}