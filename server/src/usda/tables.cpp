#pragma once

namespace usda {

struct data_src {
    static constexpr const char* DataSrc_ID = "DataSrc_ID";
    static constexpr const char* Authors = "Authors";
    static constexpr const char* Title = "Title";
    static constexpr const char* Year = "Year";
    static constexpr const char* Journal = "Journal";
    static constexpr const char* Vol_City = "Vol_City";
    static constexpr const char* Issue_State = "Issue_State";
    static constexpr const char* Start_Page = "Start_Page";
    static constexpr const char* End_Page = "End_Page";
};

struct datsrcln {
    static constexpr const char* NDB_No = "NDB_No";
    static constexpr const char* Nutr_No = "Nutr_No";
    static constexpr const char* DataSrc_ID = "DataSrc_ID";
};

struct deriv_cd {
    static constexpr const char* Deriv_Cd = "Deriv_Cd";
    static constexpr const char* Deriv_Desc = "Deriv_Desc";
};

struct fd_group {
    static constexpr const char* FdGrp_Cd = "FdGrp_Cd";
    static constexpr const char* FdGrp_Desc = "FdGrp_Desc";
};

struct food_des {
    static constexpr const char* NDB_No = "NDB_No";
    static constexpr const char* FdGrp_Cd = "FdGrp_Cd";
    static constexpr const char* Long_Desc = "Long_Desc";
    static constexpr const char* Shrt_Desc = "Shrt_Desc";
    static constexpr const char* ComName = "ComName";
    static constexpr const char* ManufacName = "ManufacName";
    static constexpr const char* Survey = "Survey";
    static constexpr const char* Ref_desc = "Ref_desc";
    static constexpr const char* Refuse = "Refuse";
    static constexpr const char* SciName = "SciName";
    static constexpr const char* N_Factor = "N_Factor";
    static constexpr const char* Pro_Factor = "Pro_Factor";
    static constexpr const char* Fat_Factor = "Fat_Factor";
    static constexpr const char* CHO_Factor = "CHO_Factor";
};

struct footnote {
    static constexpr const char* NDB_No = "NDB_No";
    static constexpr const char* FootNt_No = "FootNt_No";
    static constexpr const char* Footnt_Typ = "Footnt_Typ";
    static constexpr const char* Nutr_No = "Nutr_No";
    static constexpr const char* Footnt_Txt = "Footnt_Txt";
};

struct langdesc {
    static constexpr const char* Factor_Code = "Factor_Code";
    static constexpr const char* Description = "Description";
};

struct langual {
    static constexpr const char* NDB_No = "NDB_No";
    static constexpr const char* Factor_Code = "Factor_Code";
};

struct nut_data {
    static constexpr const char* NDB_No = "NDB_No";
    static constexpr const char* Nutr_No = "Nutr_No";
    static constexpr const char* Nutr_Val = "Nutr_Val";
    static constexpr const char* Num_Data_Pts = "Num_Data_Pts";
    static constexpr const char* Std_Error = "Std_Error";
    static constexpr const char* Src_Cd = "Src_Cd";
    static constexpr const char* Deriv_Cd = "Deriv_Cd";
    static constexpr const char* Ref_NDB_No = "Ref_NDB_No";
    static constexpr const char* Add_Nutr_Mark = "Add_Nutr_Mark";
    static constexpr const char* Num_Studies = "Num_Studies";
    static constexpr const char* Min = "Min";
    static constexpr const char* Max = "Max";
    static constexpr const char* DF = "DF";
    static constexpr const char* Low_EB = "Low_EB";
    static constexpr const char* Up_EB = "Up_EB";
    static constexpr const char* Stat_cmt = "Stat_cmt";
    static constexpr const char* AddMod_Date = "AddMod_Date";
    static constexpr const char* CC = "CC";
};

struct nutr_def {
    static constexpr const char* Nutr_No = "Nutr_No";
    static constexpr const char* Units = "Units";
    static constexpr const char* Tagname = "Tagname";
    static constexpr const char* NutrDesc = "NutrDesc";
    static constexpr const char* Num_Dec = "Num_Dec";
    static constexpr const char* SR_Order = "SR_Order";
};

struct src_cd {
    static constexpr const char* Src_Cd = "Src_Cd";
    static constexpr const char* SrcCd_Desc = "SrcCd_Desc";
};

struct weight {
    static constexpr const char* NDB_No = "NDB_No";
    static constexpr const char* Seq = "Seq";
    static constexpr const char* Amount = "Amount";
    static constexpr const char* Msre_Desc = "Msre_Desc";
    static constexpr const char* Gm_Wgt = "Gm_Wgt";
    static constexpr const char* Num_Data_Pts = "Num_Data_Pts";
    static constexpr const char* Std_Dev = "Std_Dev";
};

}
