import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {type Book, gridTemplate} from "../App.tsx";
import {useState} from "react";

type Props = { book: Book }

export const AccordionApp = ({book}: Props) => {
    const [open, setOpen] = useState(false);

    return <Accordion key={book.isbn} disableGutters>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls={book.isbn}
            id={book.isbn}
            onClick={() => setOpen(true)}
        >
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: gridTemplate },
                    width: '100%'
                }}>
                    <Typography component="span">{book.index}</Typography>
                    <Typography component="span">{book.isbn}</Typography>
                    <Typography component="span" sx={{fontWeight: 'bold'}}>{book.title}</Typography>
                    <Typography component="span">{book.author}</Typography>
                    <Typography component="span">{book.publisher}</Typography>
                </Box>
        </AccordionSummary>
        <AccordionDetails>
            <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center'}}>
                <Box>
                    <Box sx={{minWidth: 100}} position='relative'>
                        <img
                            src={open ? book.coverUrl : ''}
                            alt={`Cover of ${book.title}`}
                            style={{
                                width: '200px',
                                height: '300px',
                                objectFit: "cover",
                                borderRadius: 4
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                p: 1,
                                borderRadius: '4px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                                color: '#fff',
                                textAlign: 'center',
                                width: '200px', height: '300px'
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight="bold">
                                {book.title}
                            </Typography>
                            <Typography variant="caption">{book.author}</Typography>
                        </Box>
                    </Box>
                    <Typography variant="subtitle2" align="center" mt={1}>
                        👍 {book.likes} | 💬 {book.reviews.length}
                    </Typography>
                </Box>
                <Box sx={{flexGrow: 1}}>
                    <Typography variant="h6" sx={{mb: 1, fontWeight: 'bold'}}> {book.title}</Typography>
                    {book.reviews.map((review, i) => (
                        <Box key={i} sx={{mb: 2}}>
                            <Typography variant="subtitle2"
                                        color='textSecondary'> - {review.author}:</Typography>
                            <Typography variant="body2">{`"${review.content}"`}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </AccordionDetails>
    </Accordion>
}