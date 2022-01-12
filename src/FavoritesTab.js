import { Accordion, Box, Heading } from "grommet";
import { IconButton } from "./common/buttons";
import { Ascend, Clock, Descend, Star } from "grommet-icons";
import { useContext, useEffect, useState, useCallback } from "react";
import FavoritesListItem from "./FavoritesListItem";
import Context from "./utils/context";

const FavoritesTab = () => {
    const context = useContext(Context);
    const { activeIds } = context.session;
    const [activePanels, setActivePanels] = useState([]);
    const [sortBy, setSortBy] = useState({ type: "rating", direction: "descending" });
    const [sortedFaves, setSortedFaves] = useState([]);

    const { savedIdeas } = context.favorites;

    const handleToggleSort = (e) => {
        const { name } = e.currentTarget;
        setSortBy((prevState) => {
            if (name === prevState.type) {
                return {
                    ...prevState,
                    direction: prevState.direction === "descending" ? "ascending" : "descending",
                };
            } else {
                return {
                    type: name,
                    direction: "descending",
                };
            }
        });
    };

    const handleActivePanels = (array) => {
        //get ids of active indices from sortedFavorites
        const ids = array.map((activeIndex) => sortedFaves[activeIndex]);

        context.handleSetActiveIds(ids);

        //setActivePanels with array of indices of active Ids
        setActivePanels(getPanelsById(ids));
    };

    const getPanelsById = useCallback(
        (ids) => {
            const panels = ids.reduce((acc, id) => {
                const index = sortedFaves.indexOf(id);
                if (index >= 0) acc.push(index);
                return acc;
            }, []);
            return panels;
        },
        [sortedFaves]
    );

    useEffect(() => {
        setActivePanels(getPanelsById(activeIds));
    }, [activeIds, getPanelsById]);

    useEffect(() => {
        const keys = Object.keys(savedIdeas);
        //return if savedIdeas is one or fewer
        if (keys.length < 2) return;

        //sort savedIdeas depending on sortBy
        const sortedSavedIdeas = keys.sort((a, b) => {
            switch (sortBy.type) {
                case "rating":
                    const ratingA = savedIdeas[a].rating;
                    const ratingB = savedIdeas[b].rating;
                    return sortBy.direction === "descending"
                        ? ratingB - ratingA
                        : ratingA - ratingB;
                case "created":
                    const timeA = savedIdeas[a].created.seconds;
                    const timeB = savedIdeas[b].created.seconds;
                    return sortBy.direction === "descending" ? timeB - timeA : timeA - timeB;
                default:
                    return 0;
            }
        });
        setSortedFaves(sortedSavedIdeas);
    }, [savedIdeas, sortBy]);

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
                        <IconButton
                            size='small'
                            onClick={handleToggleSort}
                            name='rating'
                            backgroundColor={sortBy.type === "rating" && "accent-1"}
                        >
                            <Box direction='row' align='center' height='24px' width='24px'>
                                <Star size='small' color={sortBy.type === "rating" && "dark-1"} />
                                {sortBy.type === "rating" && sortBy.direction === "ascending" ? (
                                    <Ascend
                                        size='small'
                                        color={sortBy.type === "rating" && "dark-1"}
                                    />
                                ) : (
                                    <Descend
                                        size='small'
                                        color={sortBy.type === "rating" && "dark-1"}
                                    />
                                )}
                            </Box>
                        </IconButton>
                        <IconButton
                            size='small'
                            onClick={handleToggleSort}
                            name='created'
                            backgroundColor={sortBy.type === "created" && "accent-1"}
                        >
                            <Box direction='row' align='center' height='24px' width='24px'>
                                <Clock size='small' color={sortBy.type === "created" && "dark-1"} />
                                {sortBy.type === "created" && sortBy.direction === "ascending" ? (
                                    <Ascend
                                        size='small'
                                        color={sortBy.type === "created" && "dark-1"}
                                    />
                                ) : (
                                    <Descend
                                        size='small'
                                        color={sortBy.type === "created" && "dark-1"}
                                    />
                                )}
                            </Box>
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box>
                <Accordion multiple activeIndex={activePanels} onActive={handleActivePanels}>
                    {sortedFaves.map((key) => {
                        if (context.favorites.savedIdeas[key]) {
                            return (
                                <FavoritesListItem
                                    item={context.favorites.savedIdeas[key]}
                                    itemId={key}
                                    key={`${key}`}
                                />
                            );
                        } else return null;
                    })}
                </Accordion>
            </Box>
        </Box>
    );
};

export default FavoritesTab;
