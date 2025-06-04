import {Slider, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import useDebounce from "../custom-hooks/use-debaunce.tsx";


type Props = {
    onLikesChange: (value: number) => void;
}
export const SliderApp = ({onLikesChange}: Props)=>{
    const [likes, setLikes] = useState(5)
    const value = useDebounce(likes , 1000);

    useEffect(()=>{
        onLikesChange(value)
    }, [value])

    return <>
        <Typography gutterBottom>Likes</Typography>
        <Slider
            value={likes}
            onChange={(_, value) => setLikes(value as number)}
            step={0.1}
            min={0}
            max={10}
            valueLabelDisplay="auto"

        /></>
}