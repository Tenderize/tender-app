import { FC, useEffect, useState } from "react";
import { Box, Button, ButtonExtendedProps, Nav, Table, TableBody, TableCell, TableRow, Text } from "grommet";
import { Foot, GrommetWrapper, stakers } from "@tender/shared/src/index";
import Navbar from "../../components/nav";
import { tickerInfo, TickerInfo } from "data/tickerInfo";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

const stakersArray = Object.values(stakers);

const TickerInfoPage: FC = () => {
  const router = useRouter();
  const [activeToken, setActiveToken] = useState(router.query.slug as string);

  useEffect(() => {
    setActiveToken(router.query.slug as string);
  }, [router.query.slug]);

  const currentTickerInfo = tickerInfo.find((item) => item.symbol.toLowerCase() === activeToken) as TickerInfo;
  return (
    <GrommetWrapper
      style={{
        background: "#0B0C0F",
      }}
    >
      <Navbar />
      <Box direction="row">
        <Nav width="medium" gap="small">
          {tickerInfo.map((ticker) => {
            const staker = stakersArray.find((staker) => ticker.symbol.includes(staker.symbol));
            const logo = (ticker.derivative ? staker?.bwTenderLogo : staker?.bwLogo) ?? "";
            return (
              <SidebarButton
                logo={`/${logo}`}
                label={ticker.symbol}
                active={ticker.symbol.toLowerCase() === activeToken}
                key={ticker.symbol}
                justify="between"
              />
            );
          })}
        </Nav>
        <Box>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell scope="row">
                <strong>Name</strong>
              </TableCell>
              <TableCell>{currentTickerInfo.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">
                <strong>Symbol</strong>
              </TableCell>
              <TableCell>{currentTickerInfo.symbol}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
       <Text>{currentTickerInfo.description}</Text>
        </Box>
      </Box>
      <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
        }}
      >
        <Foot />
      </div>
    </GrommetWrapper>
  );
};

const SidebarButton: FC<ButtonExtendedProps & { logo: string; label: string }> = (props) => {
  const { label, logo, active, ...rest } = props;
  return (
    <Button plain {...rest}>
      {({ hover }) => (
        <Link href={`/tokens/${label.toLowerCase()}`} passHref>
          <Box
            background={hover ? "brand" : active ? "darkgrey" : "#0B0C0F"}
            pad={{ horizontal: "large", vertical: "medium" }}
            justify="between"
            direction="row"
          >
            <Image width={30} height={30} src={logo} />
            <Text size="medium">{label}</Text>
          </Box>
        </Link>
      )}
    </Button>
  );
};

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

export const getStaticPaths = async () => {
  return {
    paths: tickerInfo.map((ticker) => ({ params: { slug: ticker.symbol.toLowerCase() } })),
    fallback: false,
  };
};

export default TickerInfoPage;
