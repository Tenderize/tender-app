import { signERC2612Permit } from "eth-permit";

type ERC2612Permit = Awaited<ReturnType<typeof signERC2612Permit>>;

const patchPermit = (permit: ERC2612Permit) => {
  return {
    ...permit,
    v: permit.v === 0 || permit.v === 1 ? permit.v + 27 : permit.v
  };
};

export const signERC2612PermitPatched = async (
  provider: any,
  token: string,
  owner: string,
  spender: string,
  value?: string | number,
  deadline?: number | undefined,
  nonce?: number | undefined
): Promise<ERC2612Permit> => {
  const result = await signERC2612Permit(provider, token, owner, spender, value, deadline, nonce);
  return patchPermit(result);
};
