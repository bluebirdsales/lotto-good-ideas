import { Accordion, Box, Button, Heading } from "grommet";
import { IconButton } from "./common/buttons";
import { Descend, Star } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import FavoritesListItem from "./FavoritesListItem";
import Context from "./utils/context";

const FavoritesTab = () => {
    const context = useContext(Context);

    const [activePanels, setActivePanels] = useState([]);

    const { savedIdeas } = context.favorites;

    // const sortedFaves = Object.keys(savedIdeas).sort((a, b) => {
    //     const textA = savedIdeas[a].idea.toLowerCase();
    //     const textB = savedIdeas[b].idea.toLowerCase();
    //     return textA < textB ? -1 : textA > textB ? 1 : 0;
    // });

    const sortedFaves = Object.keys(savedIdeas).sort((a, b) => {
        const ratingA = savedIdeas[a].rating;
        const ratingB = savedIdeas[b].rating;
        return ratingB - ratingA;
    });

    const handleActivePanels = (array) => {
        setActivePanels(array);
        window.localStorage.setItem("activePanels", JSON.stringify(array));
    };

    useEffect(() => {
        setActivePanels(JSON.parse(window.localStorage.getItem("activePanels")));
    }, []);

    return (
        <Box
            background={{ color: "primary" }}
            pad={{ horizontal: "medium", vertical: "none" }}
            flex
        >
            <Box direction='row' align='center' justify='between'>
                <Heading level='3'>Favorites</Heading>
                <Box>
                    <Box direction='row'>
                        <IconButton size='small'>
                            <Box direction='row' align='center' height='24px' width='24px'>
                                <Star size='small' />
                                <Descend size='small' />
                            </Box>
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box>
                <Accordion multiple activeIndex={activePanels} onActive={handleActivePanels}>
                    {sortedFaves.map((key) => (
                        <FavoritesListItem
                            item={context.favorites.savedIdeas[key]}
                            itemId={key}
                            key={`${key}`}
                        />
                    ))}
                </Accordion>
            </Box>
        </Box>
    );
};

export default FavoritesTab;
