using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DXInfo.Web.Models
{
    //public class NameCodesViewModel
    //{
    //    public string Type { get; set; }
    //    public string Code { get; set; }
    //    public string Name { get; set; }
    //    public string Value { get; set; }
    //    public string Comment { get; set; }
    //}
    //public class DeptsViewModel
    //{
    //    public class Depts
    //    {
    //        public string DeptCode { get; set; }
    //        public string DeptName { get; set; }
    //        public string Address { get; set; }
    //        public string Comment { get; set; }
    //        public bool IsDeptPrice { get; set; }
    //        public Guid OrganizationId { get; set; }
    //        public int DeptType { get; set; }
    //    }
    //    public class Organizations
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class NameCode
    //    {
    //        public string Name { get; set; }
    //    }

    //}
    //public class OrganizationsViewModel
    //{
    //    public string Code { get; set; }
    //    public string Name { get; set; }
    //    public string Comment { get; set; }
    //}
    //public class CategoryViewModel
    //{
    //    public class InventoryCategory
    //    {
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public string Comment { get; set; }
    //        public bool IsDiscount { get; set; }
    //        public int? ProductType { get; set; }
    //    }

    //    public class EnumTypeDescription
    //    {
    //        public string Description { get; set; }
    //    }
    //}
    //public class ShopCategoryViewModel
    //{
    //    public class InventoryCategory
    //    {
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public string Comment { get; set; }
    //        public bool IsDiscount { get; set; }
    //        public int? SectionType { get; set; }
    //        public int? ProductType { get; set; }
    //    }
        
    //    public class EnumTypeDescription
    //    {
    //        public string Description { get; set; }
    //    }
    //    public class NameCode
    //    {
    //        public string Name { get; set; }
    //    }
    //}
    //public class CDInventoryViewModel
    //{
    //    public class Inventory
    //    {
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public Guid Category { get; set; }
    //        public Guid? UnitOfMeasure { get; set; }
    //        public decimal SalePrice { get; set; }
    //        public decimal SalePrice0 { get; set; }
    //        public decimal SalePrice1 { get; set; }
    //        public decimal SalePrice2 { get; set; }
    //        public decimal SalePoint { get; set; }
    //        public decimal SalePoint0 { get; set; }
    //        public decimal SalePoint1 { get; set; }
    //        public decimal SalePoint2 { get; set; }
    //        public string Specs { get; set; }
    //        public bool IsDonate { get; set; }
    //        public string Comment { get; set; }
    //        public bool IsInvalid { get; set; }
    //    }
    //    public class InventoryCategory
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class UnitOfMeasures
    //    {
    //        public string Name { get; set; }
    //    }
    //}
    //public class WRInventoryViewModel
    //{
    //    public class Inventory
    //    {
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public string EnglishName { get; set; }
    //        public Guid Category { get; set; }
    //        public Guid? UnitOfMeasure { get; set; }
    //        public decimal SalePrice { get; set; }
    //        public decimal SalePrice0 { get; set; }
    //        public decimal SalePrice1 { get; set; }
    //        public decimal SalePrice2 { get; set; }
    //        public decimal SalePoint { get; set; }
    //        public decimal SalePoint0 { get; set; }
    //        public decimal SalePoint1 { get; set; }
    //        public decimal SalePoint2 { get; set; }
    //        public bool IsRecommend { get; set; }
    //        public string ImageFileName { get; set; }
    //        public string Specs { get; set; }
    //        public bool IsDonate { get; set; }
    //        public string Comment { get; set; }
    //        public int Stars { get; set; }
    //        public string Feature { get; set; }
    //        public string Dosage { get; set; }
    //        public string Palette { get; set; }
    //        public string Printer { get; set; }
    //        public string EnglishIntroduce { get; set; }
    //        public string EnglishDosage { get; set; }
    //        public bool IsPackage { get; set; }
    //        public int Sort { get; set; }
    //        public bool IsInvalid { get; set; }
    //    }
    //    public class InventoryCategory
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class UnitOfMeasures
    //    {
    //        public string Name { get; set; }
    //    }
    //}
    //public class STInventoryViewModel
    //{
    //    public class Inventory
    //    {
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public Guid Category { get; set; }
    //        public Guid MeasurementUnitGroup { get; set; }
    //        public Guid? UnitOfMeasure { get; set; }
    //        public Guid MainUnit { get; set; }
    //        public Guid StockUnit { get; set; }
    //        public string Specs { get; set; }
    //        public string Comment { get; set; }
    //        public bool IsInvalid { get; set; }
    //        public decimal HighStock { get; set; }
    //        public decimal LowStock { get; set; }
    //        public decimal SecurityStock { get; set; }
    //        public DateTime LastCheckDate { get; set; }
    //        public int CheckCycle { get; set; }
    //        public int SomeDay { get; set; }
    //        public int EarlyWarningDay { get; set; }
    //        public int ShelfLife { get; set; }
    //        public int ShelfLifeType { get; set; }
    //    }
    //    public class InventoryCategory
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class MeasurementUnitGroup
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class UnitOfMeasures
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class MainUnitOfMeasures
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class StockUnitOfMeasures
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class CheckCycleEnumTypeDescription
    //    {
    //        public string Description { get; set; }
    //    }
    //    public class ShelfLifeTypeEnumTypeDescription
    //    {
    //        public string Description { get; set; }
    //    }
    //}
    //public class MeasurementUnitGroupViewModel
    //{
    //    public class MeasurementUnitGroup
    //    {
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public int Category { get; set; }
    //        public string Comment { get; set; }
    //    }
    //    public class EnumTypeDescription
    //    {
    //        public string Description { get; set; }
    //    }
    //}
    //public class UnitOfMeasuresViewModel
    //{
    //    public class UnitOfMeasures
    //    {
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public Guid Group { get; set; }
    //        public decimal Rate { get; set; }
    //        public bool IsMain { get; set; }
    //        public string Comment { get; set; }
    //    }
    //    public class MeasurementUnitGroup
    //    {
    //        public string Name { get; set; }
    //    }
    //}
    //public class InvPriceViewModel
    //{
    //    public class InvPrice
    //    {
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public Guid InvId { get; set; }
    //        public decimal SalePrice { get; set; }
    //        public decimal SalePoint { get; set; }
    //        public string Comment { get; set; }
    //        public bool IsInvalid { get; set; }
    //    }
    //    public class Inventory
    //    {
    //        public string Name { get; set; }
    //    }
    //}
    //public class InvDeptsViewModel
    //{
    //    public class InvDepts
    //    {
    //        public Guid Inv { get; set; }
    //        public Guid Dept { get; set; }
    //    }
    //    public class Inventory
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class Depts
    //    {
    //        public string DeptName { get; set; }
    //    }
    //}
    //public class InventoryDeptPriceViewModel
    //{
    //    public class InventoryDeptPrice
    //    {
    //        public Guid InvId { get; set; }
    //        public Guid DeptId { get; set; }
    //        public decimal SalePrice { get; set; }
    //        public decimal SalePrice0 { get; set; }
    //        public decimal SalePrice1 { get; set; }
    //        public decimal SalePrice2 { get; set; }
    //        public decimal SalePoint { get; set; }
    //        public decimal SalePoint0 { get; set; }
    //        public decimal SalePoint1 { get; set; }
    //        public decimal SalePoint2 { get; set; }
    //    }
    //    public class Inventory
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class Depts
    //    {
    //        public string DeptName { get; set; }
    //    }
    //}
    //public class CategoryDeptsViewModel
    //{
    //    public class CategoryDepts
    //    {
    //        public Guid Category { get; set; }
    //        public Guid Dept { get; set; }
    //        public string Comment { get; set; }
    //    }
    //    public class InventoryCategory
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class Depts
    //    {
    //        public string DeptName { get; set; }
    //    }
    //}
    //public class PackagesViewModel
    //{
    //    public class Packages
    //    {
    //        public Guid PackageId { get; set; }
    //        public Guid InventoryId { get; set; }
    //        public decimal Price { get; set; }
    //        public bool IsOptional { get; set; }
    //        public string OptionalGroup { get; set; }
    //        public string Comment { get; set; }
    //    }
    //    public class PackageInventory
    //    {
    //        public string Name { get; set; }
    //    }
    //    public class Inventory
    //    {
    //        public string Name { get; set; }
    //    }
    //}
    //public class RechargeDonationsViewModel
    //{
    //    public class RechargeDonations
    //    {
    //        public Guid DeptId { get; set; }
    //        public decimal BeginAmount { get; set; }
    //        public decimal DonationRatio { get; set; }
    //        public decimal DonationTopLimit { get; set; }
    //        public string Comment { get; set; }
    //    }
    //    public class Depts
    //    {
    //        public string DeptName { get; set; }
    //    }
    //}
    //public class CardLevelsViewModel
    //{
    //    public class CardLevels
    //    {
    //        public Guid DeptId { get; set; }
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public decimal Discount { get; set; }
    //        public string BeginLetter { get; set; }
    //        public decimal Point { get; set; }
    //        public bool IsDefault { get; set; }
    //        public string Comment { get; set; }
    //    }
    //    public class Depts
    //    {
    //        public string Name { get; set; }
    //    }
    //}
    //public class ConsumePointsViewModel
    //{
    //    public class ConsumePoints
    //    {
    //        public Guid DeptId { get; set; }
    //        public Guid Category { get; set; }
    //        public decimal Amount { get; set; }
    //        public decimal Point { get; set; }
    //        public string Comment { get; set; }
    //    }
    //    public class Depts
    //    {
    //        public string DeptName { get; set; }
    //    }
    //    public class InventoryCatergory
    //    {
    //        public string Name { get; set; }
    //    }
    //}
    //public class TastesViewModel
    //{
    //    public class Tastes
    //    {
    //        public Guid DeptId { get; set; }
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public string Comment { get; set; }
    //    }
    //    public class Depts
    //    {
    //        public string DeptName { get; set; }
    //    }
    //}
    //public class CardDonateInventoryViewModel
    //{
    //    public class CardDonateInventory
    //    {
    //        public Guid CardId { get; set; }
    //        public Guid Inventory { get; set; }
    //        public bool IsValidate { get; set; }
    //        public DateTime InvalideDate { get; set; }
    //    }
    //    public class Cards
    //    {
    //        public string CardNo { get; set; }
    //    }
    //    public class Inventory
    //    {
    //        public string Name { get; set; }
    //    }
    //}
    //public class CardTypesViewModel
    //{
    //    public string Code { get; set; }
    //    public string Name { get; set; }
    //    public string Comment { get; set; }
    //    public bool IsMoney { get; set; }
    //    public bool IsVirtual { get; set; }
    //    public string CardNoRule { get; set; }
    //}
    //public class PayTypesViewModel
    //{
    //    public class PayTypes
    //    {
    //        public string Code { get; set; }
    //        public string Name { get; set; }
    //        public string Comment { get; set; }
    //        public int PayType { get; set; }
    //    }
    //    public class NameCode
    //    {
    //        public string Name { get; set; }
    //    }
    //}
    //public class aspnet_SitemapsViewModel
    //{
    //    public string Name { get; set; }
    //    public string Title { get; set; }
    //    public string Description { get; set; }
    //    public string Controller { get; set; }
    //    public string Action { get; set; }
    //    public string ParaId { get; set; }
    //    public string Url { get; set; }
    //    public string ParentCode { get; set; }
    //    public bool IsAuthorize { get; set; }
    //    public bool IsMenu { get; set; }
    //    public bool IsClient { get; set; }
    //    public int Sort { get; set; }
    //}
}
