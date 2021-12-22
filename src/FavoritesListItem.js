import { useContext, useState } from "react";
import { AccordionPanel, Box, Text } from "grommet";

import Context from "./utils/context";
import FavoritesAccordionLabel from "./FavoritesAccordionLabel";
import dayjs from 'dayjs';

const FavoritesListItem = ({ item, itemId }) => {
    const context = useContext(Context);

    const handleChangeRating = (newRating, name, e) => {
        e.stopPropagation();
        context.handleChangeRating(itemId, newRating);
        console.log(name);
    };

    return (
        <AccordionPanel
            label={
                <FavoritesAccordionLabel
                    item={item}
                    handleChangeRating={handleChangeRating}
                    itemId={itemId}
                />
            }
            fill
            direction='row'
            align='center'
            justify='between'
            width='medium'
        >
            <Box direction='row' align='center' justify='between' fill>
                <Box direction='row'>
                    {item.category1[0].length ? (
                        <Text margin={{ right: "medium" }}>{item.category1[0]}</Text>
                    ) : null}
                    {item.category2[0].length ? (
                        <Text>
                            {item.category2[0]} + {item.category2[1]}
                        </Text>
                    ) : null}
                </Box>
                <Text>{dayjs.unix(item.created.seconds).format('ddd MMM DD, YYYY hh:mm a')}</Text>
            </Box>
        </AccordionPanel>
    );
};

export default FavoritesListItem;
