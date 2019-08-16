<?php
/**
 * Created by PhpStorm.
 * User: buried_01
 * Date: 2019/6/24
 * Time: 9:09
 */
namespace app\project\model;

use think\db;
use think\Model;

class ProjectModel extends Model{
    //---修改区开始---
    //输入框大小需要自己进入print具体根据条件修改大小
    
    private $tableName = "yg_project";
    private $tableHead = "项目表管理";

    //填充wantSelect 想有下拉框查询的字段数组
    public function fillWantSelect(){
        $wantSelect = ["type_id","year","college_id"];
        return $wantSelect;
    }
    //---修改区结束---



    //加工myWhereHandle 实现模糊查询
    public function myWhereHandle($myWhere){    
        $keys = array_keys($myWhere); //键名
        $myWhereHandle = [];

        for($i=0;$i<count($myWhere);$i++){
            array_push($myWhereHandle, []);
            array_push($myWhereHandle[$i], $keys[$i]);
            //如果是name 或者 title 
            if(!strcmp($keys[$i], "name")||!strcmp($keys[$i], "title")){
                array_push($myWhereHandle[$i], "like");
                array_push($myWhereHandle[$i], "%".$myWhere[$keys[$i]]."%");
            }
            else{
                array_push($myWhereHandle[$i], "=");
                array_push($myWhereHandle[$i], $myWhere[$keys[$i]]);
            }
        }

        //print_r($myWhereHandle);

        return $myWhereHandle;
    }

    //wantSelect数组 原[0=>'id'] 现[0=>'id','id'=>值]
    public function getWantSelect(){
        $wantSelect = $this->fillWantSelect();
        $selectLen = count($wantSelect);
        for($w=0;$w<$selectLen;$w++){
            $temp=Db::table($this->tableName)->query("select distinct ".$wantSelect[$w]." from ".$this->tableName);

            //下拉框值默认为X
            $wantSelect[$wantSelect[$w]]=["X"];
            for($m=0;$m<count($temp);$m++){
                array_push($wantSelect[$wantSelect[$w]], $temp[$m][$wantSelect[$w]]);
            }
        }
        return $wantSelect;
    }

    //update
    public function updateTable($updateID,$result){
        Db::table($this->tableName)->where('id',$updateID)->update($result); 
    }

    //edit(开启session填充表单)
    public function editTable($editID){
        $result = Db::table($this->tableName)->where('id',$editID)->find();
        if(!session_status())
            session_start();
        $_SESSION['session_array']=$result;
    }

    //add
    public function addTable($id,$result){
        $len =""; //多少个?
        $need = array_values($result); //值

        for($i=0;$i<count($result);$i++){
            $len .='?';
            if($i!=(count($result)-1)){
                $len .=",";
            }
        }

        Db::table($this->tableName)
            ->execute('insert into '.$this->tableName.' values('.$len.')',$need);
    }

    //delete
    public function deleteTable($deleteID){
        Db::table($this->tableName)->where('id',$deleteID)->delete();
    }

    //print
    public function printTable($myWhere,$page=1){
        //selectType_id selectYear selectCollege_id selectId selectTitle
        $wantSelect =$this->getWantSelect();

        //是否加工myWhere
        if(is_array($myWhere))
            $myWhereHandle = $this->myWhereHandle($myWhere);
        else
            $myWhereHandle = "";


        //$result默认为添加功能服务 点击编辑后为修改功能服务
        $result =[];
        $columns = Db::table($this->tableName)->query("select COLUMN_NAME from information_schema.COLUMNS where table_name='".$this->tableName."'");
        for($i=0;$i<count($columns);$i++)
            $result[$columns[$i]["COLUMN_NAME"]]=null;
                
        //接收编辑功能的数据赋值
        if(isSet($_SESSION['session_array']))
            $result = $_SESSION['session_array'];

        //填充css样式
        $table ="<style>
                    table{
                        border-collapse:collapse;
                    }
                    tr.tableHead{
                        background-color:lightgray;
                    }
                    td{
                        text-align:center;
                    }
                    td.searchTable{
                        text-align:left;
                    }
                    .smallWidth{
                        width:30px;
                    }
                    .middleWidth{
                        width:100px;
                    }
                    .bigWidth{
                        width:160px;
                    }
                    .topButton{
                        margin-top:4px;
                        margin-bottom:4px;
                    }
                    .bottomButton{
                        margin-top:4px;
                        margin-bottom:4px;
                    }
                </style>";

        $table .="
                <table border='1'>
                    <tr><td colspan='".(count($columns)+1)."'><h2>".$this->tableHead."</h2></td></tr>
                    <tr>
                        <td colspan='".(count($columns)+1)."' class='searchTable'>
                            <form action='searchTable' method='post'>";

        $radioValue="";

        //eg: 根据wantSelect["type_id"]的所有可能值 填充option 让用户选择下拉框值
        for($i=0;$i<(count($wantSelect)/2);$i++){
            $table.="
                                <font>".$wantSelect[$i]."</font>
                                <select name=\"select".ucfirst($wantSelect[$i])."\">";
            for($j=0;$j<count($wantSelect[$wantSelect[$i]]);$j++)
                $table .="          <option value=".$wantSelect[$wantSelect[$i]][$j].">".$wantSelect[$wantSelect[$i]][$j]."
                                     </option>";

            $table.="           </select>";  
        }

        //id title二选一条件查询
        $table .="
                                <font> id</font>
                                <input type='radio' name='chooseSearchType' value='id' checked='checked'>
                                
                                <font> title(支持模糊查询)</font>
                                <input type='radio' name='chooseSearchType' value='title'>
                                
                                <input class='middleWidth' type='text' name='radioValue'>

                                <input type='submit' value='查询'>
                                <input type='button' name='backSubmit' onclick='javascript:history.back(-1);' value='返回'> 
                            </form>
                        </td>
                    </tr>
                
                    <tr class='tableHead'>";

        //输出id title等所有字段标题栏
        for($i=0;$i<count($columns);$i++){
            $table.= "
                        <td class='bigWidth'>".$columns[$i]["COLUMN_NAME"]."</td>";
        }

        $table .="
                        <td class='smallWidth'>操作</td>
                    </tr>
                    <tr>
                        <form method='post' name='collegeAddOrUpdate'>";

        //输出添加修改栏的输入框
        for($i=0;$i<count($columns);$i++){
            //如果是id
            if(!strcmp("id",$columns[$i]["COLUMN_NAME"])){
                $table .="
                            <td>
                                <input class='smallWidth' type='text' name='inputID' value='".$result['id']."''>
                                <input class='smallWidth' type='hidden' name='updateID' value='".$result['id']."''>
                            </td>";
            }
            else{
                $table .="  <td>
                                <input class='bigWidth' type='text' name='input".ucfirst($columns[$i]["COLUMN_NAME"])."' value='".$result[$columns[$i]["COLUMN_NAME"]]."''>
                            </td>";
            }
        }

        $table .="
                            <td>
                                    <input class='topButton' type='submit' value='添加' onclick='wantaddTable()'><br>
                                    <input class='bottomButton' type='submit' value='修改' onclick='wantupdateTable()'>
                            </td>
                        </form>
                    </tr>";

        //分页功能 部分一 开始
        $pageDataSize=10; //每页显示数据个数
        $pageBegin =($page-1)*$pageDataSize;

        $rowTemp = Db::table($this->tableName)->where($myWhereHandle)->select();
        $rowCount=count($rowTemp);

        $pageCount = ceil($rowCount/$pageDataSize); //总页数

        $result=Db::table($this->tableName)->where($myWhereHandle)->limit($pageBegin,$pageDataSize)->select();
        //分页功能 部分一 结束
        
        //输出所有select的值
        for($i=0;$i<count($result);$i++){
            $table .="
                    <tr>";

            for($j=0;$j<count($columns);$j++)     
                $table .="
                        <td>".$result[$i][$columns[$j]["COLUMN_NAME"]]."</td>";

            //输出删除编辑按钮
            $table .="
                        <td>
                            <form method='post' action='deleteTable'>
                                <input type='hidden' name='deleteID' value='".$result[$i]['id']."'>
                                <input class='topButton' type='submit' value='删除' onclick='wantdeleteTable()'>
                            </form>
        
                            <form method='post' action='editTable'>
                                <input type='hidden' name='editID' value='".$result[$i]['id']."'>
                                <input class='bottomButton' type='submit' value='编辑' onclick='wanteditTable()'>
                            </form>
                        </td>
                    </tr>
                        ";
        }

        //分页功能部分二 开始
        $table .="  
                    <tr>
                        <td colspan='".(count($columns)+1)."'>
                            <font>第".$page."/".$pageCount."页,共 ".$pageCount." 页</font>
                                <form name='wantAddOrSubPage' method='get'>
                                    <input type='hidden' name='pageCur' value='".$page."'>
                                    <input type='hidden' name='radioValue' value='".$radioValue."'>";
        
        //myWhere是数组说明处于多条件查询状态,hidden为+-go保留myWhere,防止换页 查询条件消失                      
        if(is_array($myWhere)){
            $keys = array_keys($myWhere);
            for($i=0;$i<count($myWhere);$i++){
                $table .="        <input type='hidden' name='myWhere".ucfirst($keys[$i])."' value='".$myWhere[$keys[$i]]."'>";
            }
        }

        if($page>1)
            $table .="              
                                    <input type='submit' value='上一页' onclick='subPage()'>";
        if($page<$pageCount)
            $table .="
                                    <input type='submit' value='下一页' onclick='addPage()'>";
        $table .="
                                    <font>go:</font>
                                    <input type='text' name='goPageValue' class='smallWidth'>
                                    <input type='submit' value='跳转' onclick='goPage()'>
                                </form>
                        </td>
                    </tr>";

        $table .="</table>";
        //分页功能部分二 结束

        echo $table;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script type="text/javascript">
        //实现一个form两个action选择
        function wantaddTable(){
            document.collegeAddOrUpdate.action="addTable";
            document.collegeAddOrUpdate.submit();
        }

        function wantupdateTable(){
            document.collegeAddOrUpdate.action="updateTable";
            document.collegeAddOrUpdate.submit();
        }

        function addPage(){
            document.wantAddOrSubPage.action="addTablePage";
            document.wantAddOrSubPage.submit();
        }

        function subPage(){
            document.wantAddOrSubPage.action="subTablePage";
            document.wantAddOrSubPage.submit();
        }
        
        function goPage(){
            document.wantAddOrSubPage.action="goTablePage";
            document.wantAddOrSubPage.submit();
        }
    </script>
</head>
<body>

</body>
</html>
