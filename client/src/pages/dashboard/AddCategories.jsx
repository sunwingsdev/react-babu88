import GameSubcategoryManager from "@/components/dashboard/GameSubcategoryManager/GameSubcategoryManager";
import SubcategoryList from "@/components/dashboard/SubcategoryList/SubcategoryList";

const AddCategories = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-2">
      <GameSubcategoryManager />
      <SubcategoryList />
    </div>
  );
};

export default AddCategories;
