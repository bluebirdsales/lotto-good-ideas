import { Accordion, Box, Button, Heading } from "grommet";
import { IconButton } from "./common/buttons";
import { Descend, Star } from "grommet-icons";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import FavoritesListItem from "./FavoritesListItem";
import Context from "./utils/context";

const FavoritesTab = () => {
    const context = useContext(Context);

    const [activePanels, setActivePanels] = useState([]);
    const [activeIds, setActiveIds] = useState([]);

    const { savedIdeas } = context.favorites;

    // const sortedFaves = Object.keys(savedIdeas).sort((a, b) => {
    //     const textA = savedIdeas[a].idea.toLowerCase();
    //     const textB = savedIdeas[b].idea.toLowerCase();
    //     return textA < textB ? -1 : textA > textB ? 1 : 0;
    // });

    const sortedFaves = useMemo(
        () =>
            Object.keys(savedIdeas).sort((a, b) => {
                const ratingA = savedIdeas[a].rating;
                const ratingB = savedIdeas[b].rating;
                return ratingB - ratingA;
            }),
        [savedIdeas]
    );

    const handleActivePanels = (array) => {
        //get ids of active indices from sortedFavorites
        const ids = array.map((activeIndex) => sortedFaves[activeIndex]);
        setActiveIds(ids);
        window.localStorage.setItem("activeIds", JSON.stringify(ids));

        //setActivePanels with array of indices of active Ids
        setActivePanelsById(ids);
    };

    const setActivePanelsById = useCallback(
        (ids) => {
            const panels = ids.reduce((acc, id) => {
                const index = sortedFaves.indexOf(id);
                if (index >= 0) acc.push(index);
                return acc;
            }, []);
            setActivePanels(panels);
        },
        [sortedFaves]
    );

    useEffect(() => {
        const ids = JSON.parse(window.localStorage.getItem("activeIds"));
        if (ids) {
            setActivePanelsById(ids);
            setActiveIds(ids);
        }
    }, [setActivePanelsById]);

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
