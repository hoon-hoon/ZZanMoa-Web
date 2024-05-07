import { rank } from "@shared/atoms";
import { Divider, Text } from "@shared/components";
import { Colors } from "@shared/constants";
import { SavingList } from "@shared/types";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const Compare = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const averageRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState({ first: 0, second: 0 });
  const [priceSum, setPriceSum] = useState<number>(0);
  const [rankData] = useRecoilState(rank);

  const handleSum = (savingList: SavingList[]) => {
    let sum = 0;
    savingList.forEach(({ marketItem: { price } }) => (sum += price));

    return sum;
  };

  useEffect(() => {
    if (listRef && averageRef) {
      setWidth(() => {
        const listWidth = listRef.current?.clientWidth;
        const averageWidth = averageRef.current?.clientWidth;

        return { first: listWidth ?? 0, second: averageWidth ?? 0 };
      });
    }
  }, [listRef, averageRef]);

  useEffect(() => {
    let sum = 0;
    rankData?.itemList.forEach(({ average_price }) => (sum += average_price));
    setPriceSum(sum);
  }, []);

  return (
    <Container>
      <LogoContainer>
        <Image src="/images/logo.svg" alt="logo" width={98} height={30} />
      </LogoContainer>
      <ContentContainer>
        <ContentWrapper>
          <Image
            src="/images/receipt.svg"
            alt="receipt"
            width={519}
            height={83}
          />
          <MarketContainer>
            <MarketWrapper>
              {rankData?.rankList.map(({ market, rank, totalSaving }) => {
                return (
                  <MarketItemContainer key={market.marketId}>
                    <MarketInfo>
                      <Text
                        variant="H4"
                        color={Colors.Black900}
                        fontWeight="SemiBold"
                      >
                        {market.marketName}
                      </Text>
                      <SavingMoney $rank={rank}>
                        <Text
                          variant="Body3"
                          color={rank === 1 ? "white" : Colors.Black700}
                          fontWeight="Medium"
                        >{`${totalSaving > 0 ? `${totalSaving}원 비싸요` : `${Math.abs(totalSaving)}원 절약해요`}`}</Text>
                      </SavingMoney>
                    </MarketInfo>
                    <Graph $rank={rank} />
                  </MarketItemContainer>
                );
              })}
            </MarketWrapper>
          </MarketContainer>
          <PriceTable>
            <SelectedItem ref={listRef}>
              <TitleCell>
                <Text variant="Body2" color={Colors.Black900}>
                  품목
                </Text>
              </TitleCell>
              <ItemCell>
                {rankData?.itemList.map(({ itemId, itemName }) => {
                  return <Item key={itemId}>{itemName}</Item>;
                })}
                <SumCell>
                  <Text variant="Body2" color={Colors.Black900}>
                    총합
                  </Text>
                </SumCell>
              </ItemCell>
            </SelectedItem>
            <AveragePrice ref={averageRef}>
              <TitleCell>
                <Text variant="Body2" color={Colors.Black900}>
                  평균가
                </Text>
              </TitleCell>
              <PriceItemCell>
                {rankData?.itemList.map(({ average_price }, index) => {
                  return (
                    <PriceItem key={average_price + index}>
                      {`${average_price}원`}
                    </PriceItem>
                  );
                })}
                <PriceSumCell>
                  <Text variant="Body2" color={Colors.Black900}>
                    {`${priceSum}원`}
                  </Text>
                </PriceSumCell>
              </PriceItemCell>
            </AveragePrice>
            {rankData?.rankList.map(({ market, savingList }) => (
              <Market key={market.marketId}>
                <MarketName>
                  <Text variant="Body2" color={Colors.Black900}>
                    {market.marketName}
                  </Text>
                </MarketName>
                {savingList.map(
                  ({ marketItem: { itemId, price }, saving }, index) => {
                    return (
                      <Fragment key={itemId + saving + index}>
                        <SavingPrice $saving={saving}>
                          {`${price}원`}
                        </SavingPrice>
                      </Fragment>
                    );
                  },
                )}
                <Sum>{`${handleSum(savingList)}원`}</Sum>
              </Market>
            ))}
          </PriceTable>
          <TotalSave>
            <Saving $width={width.first + width.second}>
              <Text variant="Body3" color={Colors.Black700} fontWeight="Medium">
                절약가격
              </Text>
            </Saving>
            {rankData?.rankList.map(({ rank, market, totalSaving }) => {
              return (
                <MarketSaving
                  key={market.marketId}
                  $width={width.first + width.second}
                  $length={rankData?.rankList.length}
                  $rank={rank}
                >
                  <Text
                    variant="Body3"
                    color={rank === 1 ? "white" : Colors.Black700}
                    fontWeight="Medium"
                  >
                    {`${Math.abs(totalSaving)}원 ${totalSaving < 0 ? "비싸요" : "절약해요"}`}
                  </Text>
                </MarketSaving>
              );
            })}
          </TotalSave>
        </ContentWrapper>
        <Receipt>
          <ReceiptImageContainerUpper>
            <Image
              src="/images/receipt_up.svg"
              alt="receipt"
              width={305}
              height={21}
            />
          </ReceiptImageContainerUpper>
          <ReceiptTitle>
            {rankData?.rankList.map(({ rank, market }) => {
              return (
                <Fragment key={market.marketId + market.marketName}>
                  {rank === 1 && (
                    <Text
                      variant="H3"
                      color={Colors.Black900}
                      fontWeight="Bold"
                    >
                      {market.marketName}
                    </Text>
                  )}
                </Fragment>
              );
            })}
            <Image
              src="/images/recommend.svg"
              alt="recommend"
              width={42}
              height={43}
            />
          </ReceiptTitle>
          <Divider />
          <ItemList>
            {rankData?.rankList.map(({ rank, market, savingList }, index) => {
              return (
                <Fragment key={market.marketId + index}>
                  {rank === 1 && (
                    <>
                      {savingList.map(({ marketItem }) => {
                        return (
                          <MarketPrice key={marketItem.itemId}>
                            <Text variant="Body2" color={Colors.Black900}>
                              {marketItem.itemName}
                            </Text>
                            <Text variant="Body2" color={Colors.Black900}>
                              {marketItem.price.toLocaleString()}원
                            </Text>
                          </MarketPrice>
                        );
                      })}
                    </>
                  )}
                </Fragment>
              );
            })}
          </ItemList>
          <Divider />
          <Total>
            <PriceList>
              {rankData?.rankList.map(({ rank, totalSaving, savingList }) => {
                return (
                  <Fragment key={rank}>
                    {rank === 1 && (
                      <>
                        <TotalSaving>
                          <Text variant="Body2" color={Colors.Black900}>
                            절약 금액
                          </Text>
                          <Text variant="Body2" color={Colors.Black900}>
                            {totalSaving.toLocaleString()}원
                          </Text>
                        </TotalSaving>
                        <TotalSaving>
                          <Text
                            variant="H4"
                            color={Colors.Black900}
                            fontWeight="SemiBold"
                          >
                            총합 금액
                          </Text>
                          <Text
                            variant="Body2"
                            color={Colors.Red100}
                            fontWeight="SemiBold"
                          >
                            {handleSum(savingList).toLocaleString()}
                            <span style={{ color: Colors.Black900 }}>원</span>
                          </Text>
                        </TotalSaving>
                      </>
                    )}
                  </Fragment>
                );
              })}
            </PriceList>
            <SaveButton>
              <Text variant="Body1" color="white" fontWeight="SemiBold">
                저장하기
              </Text>
            </SaveButton>
          </Total>
          <ReceiptImageContainerDown>
            <Image
              src="/images/receipt_down.svg"
              alt="receipt"
              width={305}
              height={21}
            />
          </ReceiptImageContainerDown>
        </Receipt>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100dvw;
  height: 100dvh;
  background-color: ${Colors.Black200};
  overflow: auto;
`;

const LogoContainer = styled.div`
  height: 60px;
  background-color: white;
  padding: 15px 24px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  padding: 16px 80px;
  gap: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  border: 1px solid white;
  border-radius: 4px;
  background-color: white;
  padding: 40px 32px;
`;

const MarketContainer = styled.div`
  width: 100%;
  height: 293px;
  background-color: ${Colors.Black200};
  margin: 48px 0;
`;

const MarketWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  gap: 72px;
`;

const MarketItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: flex-end;
  gap: 12px;
`;

const MarketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SavingMoney = styled.div<{ $rank: number }>`
  width: 146px;
  border-radius: 4px;
  background-color: ${({ $rank }) =>
    $rank === 1 ? Colors.Emerald600 : Colors.Black500};
  padding: 7px 16px;
`;

const Graph = styled.div<{ $rank: number }>`
  ${({ $rank }) => {
    switch ($rank) {
      case 1:
        return `
          height: 146px;
          background: #6EE7B7;
          background: linear-gradient(
            180deg,
            #6EE7B7 0%,
            #FAFAFB 100%
          );
        `;
      case 2:
        return `
          height: 100px;
          background: #B9B9BA;
          background: linear-gradient(
            180deg,
            #B9B9BA 0%,
            #FAFAFB 100%
          );
        `;
      case 3:
        return `
          height: 64px;
          background: #B9B9BA;
          background: linear-gradient(
            180deg,
            #B9B9BA 0%,
            #FAFAFB 100%
          );
        `;
    }
  }}
  border-radius: 16px;
`;

const PriceTable = styled.div`
  display: flex;
  width: 100%;
  border-top: 1px solid ${Colors.Black500};
  border-bottom: 1px solid ${Colors.Black500};
  margin-bottom: 16px;
`;

const SelectedItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleCell = styled.div`
  text-align: center;
  padding: 12px 13px;
`;

const ItemCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Item = styled.div`
  border-radius: 4px;
  background-color: ${Colors.Black100};
  padding: 12px 13px;
  text-align-last: center;
`;

const SumCell = styled.div`
  padding: 12px 13px;
`;

const AveragePrice = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 84px;
`;

const PriceItemCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PriceItem = styled.div`
  padding: 12px 13px;
  text-align-last: right;
`;

const PriceSumCell = styled.div`
  padding: 12px 13px;
  text-align-last: right;
`;

const Market = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align-last: center;
  padding: 0 2px;
`;

const MarketName = styled.div`
  padding: 12px 13px;
`;

const SavingPrice = styled.div<{ $saving: number }>`
  padding: 12px 13px;
  text-align-last: right;
  ${({ $saving }) => {
    if ($saving > 0) {
      return `
        background-color: ${Colors.Emerald50};
      `;
    } else if ($saving < 0) {
      return `
        background-color: #FEEDEC;
      `;
    }
  }}
  margin-bottom: 16px;
`;

const Sum = styled.div`
  padding: 12px 13px;
  text-align-last: right;
`;

const TotalSave = styled.div`
  display: flex;
  gap: 4px;
`;

const Saving = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  border-radius: 4px;
  background-color: ${Colors.Black100};
  padding: 6px 13px;
  text-align: center;
`;

const MarketSaving = styled.div<{
  $width: number;
  $length?: number;
  $rank: number;
}>`
  width: ${({ $width, $length }) =>
    `calc((100% - ${$width}px - 4px) / ${$length})`};
  border-radius: 4px;
  background-color: ${({ $rank }) =>
    $rank === 1 ? Colors.Emerald600 : Colors.Black100};
  padding: 6px 13px;
  text-align: center;
`;

const Receipt = styled.div`
  position: relative;
  top: 10px;
  display: flex;
  flex-direction: column;
  min-width: 305px;
  height: fit-content;
  background-color: white;
  padding: 37px 16px;
  gap: 24px;
`;

const ReceiptImageContainerUpper = styled.div`
  position: absolute;
  left: 0;
  top: -10px;
`;

const ReceiptImageContainerDown = styled.div`
  position: absolute;
  left: 0;
  bottom: -12px;
`;

const ReceiptTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MarketPrice = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Total = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const PriceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TotalSaving = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SaveButton = styled.button`
  display: flex;
  width: fit-content;
  border: none;
  border-radius: 4px;
  background-color: ${Colors.Black900};
  padding: 4px 18px;
  align-self: self-end;
`;

export default Compare;
