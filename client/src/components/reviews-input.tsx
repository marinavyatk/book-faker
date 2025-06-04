import {TextField} from "@mui/material";
import {useEffect, useState} from "react";
import useDebounce from "../custom-hooks/use-debaunce.tsx";

type Props = {
    onReviewsChange: (value: number) => void;
}

export const ReviewsInput = ({onReviewsChange}: Props) => {
    const [reviews, setReviews] = useState(5)
    const value = useDebounce(reviews, 1000);

    useEffect(() => {
        onReviewsChange(value)
    }, [value])

    return <TextField
        fullWidth
        label="Reviews"
        type="number"
        variant="outlined"
        value={reviews}
        onChange={e => setReviews(parseFloat(e.target.value))}
        slotProps={{htmlInput: {min: "0", max: "10", step: "0.1"}}}

    />
}