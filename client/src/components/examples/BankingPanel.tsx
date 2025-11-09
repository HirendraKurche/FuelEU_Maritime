import BankingPanel from '../BankingPanel';

export default function BankingPanelExample() {
  return (
    <div className="p-6">
      <BankingPanel
        shipId="SHIP001"
        year={2025}
        cbBefore={1245.8}
        bankedAmount={892.3}
        cbAfter={1245.8}
        onBank={(amount) => console.log('Bank surplus:', amount)}
        onApply={(amount) => console.log('Apply banked:', amount)}
      />
    </div>
  );
}
