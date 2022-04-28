import { FC, MouseEventHandler, useCallback, useRef, useState } from "react";
import { Box, Text, Drop, Button } from "grommet";
import { FormDown } from "grommet-icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { constants, utils } from "ethers";
import { ChainId, Config, DAppProvider, useEthers, useTokenBalance, ArbitrumRinkeby, Rinkeby } from "@usedapp/core";
import { addresses } from "@tender/contracts/src/index";
import styled from "styled-components";
import { Staker, stakers, Foot } from "@tender/shared/src/index";
import Navbar from "../../components/nav";
import { NotificationsList } from "../../components/transactions";
import { useHover } from "utils/useHover";
import { TenderizeConfig } from "types";
import SwapPanel from "components/swap/SwapPanel";

const Token: FC = () => {
  const router = useRouter();
  const protocolName = router.query.slug as string;

  let { account } = useEthers();
  account = account ?? constants.AddressZero;
  //   const tokenBalance = useTokenBalance(addresses[protocolName].token, account) || constants.Zero;
  //   const tenderBalance = useTokenBalance(addresses[protocolName].tenderToken, account) || constants.Zero;
  //   const lpTokenBalance = useTokenBalance(addresses[protocolName].lpToken, account) || constants.Zero;

  return (
    <Box flex width="100vw" align="center" alignSelf="start">
      <SwapPanel protocolName={protocolName} account={account} />
    </Box>
  );
};

const TokenDropdown: FC<{ logo: string; title: string }> = ({ logo, title }) => {
  const options = Object.values(stakers).filter((option) => option.title !== title);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const { style, ...rest } = useHover({ backgroundColor: "rgba(0, 0, 0, 0.1)" });

  return (
    <>
      <Box
        ref={targetRef}
        style={{ flex: 1, paddingTop: 33, paddingBottom: 33, boxShadow: "none", ...style }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        {...rest}
      >
        <Box focusIndicator={false} direction="row" justify="center" align="center">
          <Box direction="column" align="center" gap="small">
            <Image width={48} height={48} src={`/${logo}`} />
            <Text color="white">{title}</Text>
          </Box>
          <FormDown color="white" />
        </Box>
      </Box>
      {targetRef.current && open && (
        <Drop
          background="transparent"
          target={targetRef.current}
          align={{ top: "bottom", left: "left" }}
          style={{ borderBottomRightRadius: 50, borderBottomLeftRadius: 50 }}
        >
          <Box round={{ size: "large" }}>
            <DropdownBackground style={{ zIndex: 1 }} />
            <Box style={{ zIndex: 2 }}>
              {options.map((option) => (
                <DropdownOption
                  key={option.title}
                  staker={option}
                  onClick={async (e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                />
              ))}
            </Box>
          </Box>
        </Drop>
      )}
    </>
  );
};

const DropdownOption: FC<{ staker: Staker; onClick: MouseEventHandler<HTMLButtonElement> }> = ({ staker, onClick }) => {
  return (
    <DropdownOptionContainer border={{ side: "bottom" }} onClick={onClick}>
      <MaybeLink staker={staker}>
        <Button fill hoverIndicator={{ color: "rgba(0, 0, 0, 0.1)" }} disabled={!staker.available}>
          <Box direction="row" justify="center" pad={{ vertical: "medium" }} gap="small">
            <Box direction="column" gap="small" align="center" pad={{ bottom: "small" }}>
              <Image width={48} height={48} src={`/${staker.bwLogo}`} />
              <Text color="light-1">{staker.title}</Text>
            </Box>
          </Box>
        </Button>
      </MaybeLink>
    </DropdownOptionContainer>
  );
};

const MaybeLink: FC<{ staker: Staker }> = ({ staker, children }) => {
  if (staker.available) {
    return <Link href={staker.path}>{children}</Link>;
  } else {
    return <>{children}</>;
  }
};

const DropdownOptionContainer = styled(Box)`
  &:last-child {
    border: unset;
  }
`;

const DropdownBackground = styled.div`
  background-image: url("/shad-defi.jpg");
  background-position: -550px -800px;
  filter: blur(2px);
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const TokenWrapper: FC<{ config?: TenderizeConfig }> = (props) => {
  const dappConfig: Config = {
    pollingInterval: 2500,
    readOnlyUrls: props.config?.chainUrlMapping,
  };

  if (props.config == null) return null;

  return (
    <DAppProvider config={dappConfig}>
      <NotificationsList />
      <Box style={{ minHeight: "100%" }}>
        <Navbar config={props.config} />
        <Token />
        <Foot />
      </Box>
    </DAppProvider>
  );
};

export const getStaticProps = async () => {
  const CHAIN_URL_MAPPING = {
    [ChainId.Rinkeby]: process.env.RPC_ETHEREUM_RINKEBY ?? "",
    [ChainId.ArbitrumRinkeby]: process.env.RPC_ARBITRUM_RINKEBY ?? "",
  };

  const config: TenderizeConfig = {
    portisApiKey: process.env.PORTIS_API_KEY ?? "",
    chainUrlMapping: CHAIN_URL_MAPPING ?? "",
    supportedChains: [ArbitrumRinkeby.chainId, Rinkeby.chainId],
  };

  return {
    props: {
      config,
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: Object.values(stakers).map((staker) => ({ params: { slug: staker.name } })),
    fallback: false,
  };
};

export default TokenWrapper;
