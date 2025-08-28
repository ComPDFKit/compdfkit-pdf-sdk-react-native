
import React from 'react';
import { View, FlatList, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { CPDFSearchItem } from '../model/CPDFSearchItem';


interface CPDFSearchTextListScreenProps {
    visible: boolean;
    list: CPDFSearchItem[];
    onClose: () => void;
    jump: (searchItem: CPDFSearchItem) => void;
}

const CPDFSearchTextListScreen: React.FC<CPDFSearchTextListScreenProps> = ({ visible, list, onClose, jump }) => {

    const highlightKeyword = (item: CPDFSearchItem) => {
        const content = item.content;
        const keyword = item.keywords;
        const keywordStartInPage = item.keywordTextRange.location;
        const contentStartInPage = item.contentTextRange.location;

        const relativeKeywordStart = keywordStartInPage - contentStartInPage;

        if (relativeKeywordStart < 0 ||
            relativeKeywordStart + keyword.length > content.length) {
            return <Text style={styles.contentText}>{content}</Text>;
        }

        return (
            <Text style={styles.contentText}>
                <Text>{content.substring(0, relativeKeywordStart)}</Text>
                <Text style={styles.highlightText}>
                    {content.substring(relativeKeywordStart, relativeKeywordStart + keyword.length)}
                </Text>
                <Text>{content.substring(relativeKeywordStart + keyword.length)}</Text>
            </Text>
        );
    };

    const renderItem = ({ item }: { item: CPDFSearchItem }) => (
        <TouchableOpacity onPress={() => {
            jump(item);
        }}>
            <View style={styles.itemContainer}>
                <Text style={styles.pageText}>Page: {item.keywordTextRange.pageIndex + 1}</Text>
                {highlightKeyword(item)}
            </View>
        </TouchableOpacity>

    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>

                <View style={styles.modalContainer}>
                    <View style={styles.container}>
                        <FlatList
                            data={list}
                            renderItem={renderItem}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>

                </View>
            </TouchableWithoutFeedback>

        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(3, 3, 3, 0.2)',
    },
    container: {
        width: '100%',
        height: '60%',
        maxHeight: '60%',
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    itemContainer: {
        padding: 16
    },
    pageText: {
        fontWeight: 'bold',
        marginBottom: 4
    },
    contentText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333'
    },
    highlightText: {
        color: 'red',
        fontWeight: 'bold'
    },
    separator: {
        height: 1,
        backgroundColor: '#eee'
    },
});

export default CPDFSearchTextListScreen;