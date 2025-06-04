import {useEffect, useState} from 'react';
import axios from 'axios';
import {AppBar, Box, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Select, Typography} from '@mui/material';
import useInfiniteScroll from "react-infinite-scroll-hook";
import {SliderApp} from "./components/slider.tsx";
import {SeedInput} from "./components/seed-input.tsx";
import {ReviewsInput} from "./components/reviews-input.tsx";
import {AccordionApp} from "./components/accordion.tsx";

const locales = [
    {label: 'English (US)', value: 'en'},
    {label: 'German (Germany)', value: 'de'},
    {label: 'Japanese (Japan)', value: 'ja'}
];

export type Book = {
    index: string,
    title: string,
    isbn: string,
    author: string,
    publisher: string,
    likes: number,
    reviews: { author: string, content: string }[],
    coverUrl: string
};

export const gridTemplate = '5% 20% 30% 25% 20%';

export default function App() {
    const [locale, setLocale] = useState('en');
    const [seed, setSeed] = useState('0');
    const [likes, setLikes] = useState(3.5);
    const [reviews, setReviews] = useState(1.5);
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchBooks = async (reset = false) => {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_BASE_URL
        const res = await axios.get(`${baseUrl}/api/books`, {
            params: {locale, seed, likes, reviews, page: reset ? 1 : page, booksPerPage: reset ? 20 : 10}
        });
        const newBooks = res.data.books;
        setBooks(prev => reset ? newBooks : [...prev, ...newBooks]);
        if (reset) setPage(2); else setPage(prev => prev + 1);
        setLoading(false);
    };

    useEffect(() => {
        fetchBooks(true);
    }, [locale, seed, likes, reviews]);

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: true,
        onLoadMore: () => fetchBooks(false),
        rootMargin: '0px 0px 400px 0px',
    });

    return (
        <Box>
            <AppBar position="sticky" color="default" sx={{p: 2}}>
                <Typography variant="h5" component="h1" sx={{mb: 2}} color={'primary'}>
                    📚 Book Generator
                </Typography>
                <Grid container spacing={{xs: 1, sm:2}} sx={{flexWrap: 'wrap'}}>
                    <Grid size={{xs: 12, md: 3}}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="locale-label">Locale</InputLabel>
                            <Select
                                labelId="locale-label"
                                value={locale}
                                label="Locale"
                                onChange={e => setLocale(e.target.value)}
                                variant='outlined'
                            >
                                {locales.map(loc => (
                                    <MenuItem key={loc.value} value={loc.value}>{loc.label}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <SeedInput onSeedChange={setSeed}/>
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <SliderApp onLikesChange={setLikes}/>
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <ReviewsInput onReviewsChange={setReviews}/>
                    </Grid>
                </Grid>
                <Box sx={{display: {xs: 'none', md: 'block'}, overflowX: 'auto', width: '100%'}}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: gridTemplate, width: '100%',
                    mt: 1
                }}>
                    <Typography component="span">#</Typography>
                    <Typography component="span">ISBN</Typography>
                    <Typography component="span" sx={{fontWeight: 'bold'}}>Title</Typography>
                    <Typography component="span">Author</Typography>
                    <Typography component="span">Publisher</Typography>
                </Box>
                </Box>
            </AppBar>
            <Box sx={{ overflowY: 'scroll', maxWidth: '100vw'}}>
                {books.map(book => {
                    return <AccordionApp book={book} key={book.isbn}/>
                })}
                <Box sx={{width: '100%', mt: '50px'}}>
                    <LinearProgress ref={sentryRef}/>
                </Box>
            </Box>
        </Box>
    );
}