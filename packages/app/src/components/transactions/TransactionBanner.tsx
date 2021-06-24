import { Modal, Box, Flex, Icon, Text, Link } from "rimble-ui";

export default function TransactionBanner() {
  return (
    <Flex flexDirection="column">
      <Box width="10%" height="8px" bg="success" />
      <Box p={[2, 3]} color="near-white" width="100%" bg="dark-gray">
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Flex
              mr={[2, 3]}
              bg={"silver"}
              borderRadius={"50%"}
              height={"3em"}
              width={"3em"}
              minWidth={"3em"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Text>10%</Text>
            </Flex>
            <Flex flexDirection="column">
              <Text fontWeight="bold">Sending...</Text>
              <Text fontSize={1}>Less than 3 minutes remaining</Text>
            </Flex>
          </Flex>
          <Link color="primary-lighter" ml={[2, 3]}>
            <Flex alignItems="center">
              Details
              <Icon ml={1} name="Launch" size="16px" />
            </Flex>
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
}
