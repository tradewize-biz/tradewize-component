declare const styles: {
    left: {
        container: {
            alignItems: "flex-start";
        };
        wrapper: {
            borderRadius: number;
            backgroundColor: string;
            marginRight: number;
            minHeight: number;
            justifyContent: "flex-end";
        };
        containerToNext: {
            borderBottomLeftRadius: number;
        };
        containerToPrevious: {
            borderTopLeftRadius: number;
        };
        bottom: {
            flexDirection: "row";
            justifyContent: "flex-start";
        };
    };
    right: {
        container: {
            alignItems: "flex-end";
        };
        wrapper: {
            borderRadius: number;
            backgroundColor: string;
            marginLeft: number;
            minHeight: number;
            justifyContent: "flex-end";
        };
        containerToNext: {
            borderBottomRightRadius: number;
        };
        containerToPrevious: {
            borderTopRightRadius: number;
        };
        bottom: {
            flexDirection: "row";
            justifyContent: "flex-end";
        };
    };
    content: {
        tick: {
            fontSize: number;
            backgroundColor: string;
            color: string;
        };
        tickView: {
            flexDirection: "row";
            marginRight: number;
        };
        username: {
            top: number;
            left: number;
            fontSize: number;
            backgroundColor: string;
            color: string;
        };
        usernameView: {
            flexDirection: "row";
            marginHorizontal: number;
        };
        layoutName: {
            paddingVertical: number;
            width: "80%";
        };
        name: {
            fontSize: number;
            color: string;
            fontWeight: "semibold";
        };
        reactionContainer: {
            backgroundColor: string;
            position: "absolute";
            minWidth: number;
            height: number;
            borderRadius: number;
            justifyContent: "center";
            alignItems: "center";
            borderWidth: number;
            borderColor: string;
            bottom: number;
            zIndex: number;
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
            flexDirection: "row";
            gap: number;
        };
        reactionEmojiText: {
            fontSize: number;
        };
        reactionCountText: {
            fontSize: number;
        };
        sendingIndicator: {
            height: number;
            alignItems: "center";
            justifyContent: "center";
            paddingHorizontal: number;
        };
        errorContainer: {
            marginTop: number;
            flexDirection: "row";
            alignItems: "center";
            gap: number;
        };
        errorIcon: {
            width: number;
            height: number;
        };
        errorText: {
            fontSize: number;
            fontWeight: "500";
            color: string;
        };
    };
};
export default styles;
