<?php
namespace app\project\model;

use think\db;
use think\Model;

class ProjectqueryModel extends Model{ 
    //修改区开始
    private $tableName = "yg_project";
    private $tableHead = "项目查询";

    //填充wantSelect 想有下拉框查询的字段数组
    public function fillWantSelect(){
        $wantSelect = ["type_id","year","college_id"];
        return $wantSelect;
    }
    //修改区结束
    


    //加工myWhereHandle 实现模糊查询
    public function myWhereHandle($myWhere){    
        $keys = array_keys($myWhere); //键名
        $myWhereHandle = [];

        for($i=0;$i<count($myWhere);$i++){
            array_push($myWhereHandle, []);
            //如果是name 
            if(!strcmp($keys[$i], "name")){
                array_push($myWhereHandle[$i], 'manager|participator');
                array_push($myWhereHandle[$i], "like");
                array_push($myWhereHandle[$i], "%".$myWhere[$keys[$i]]."%");
            }
            else{
                array_push($myWhereHandle[$i], $keys[$i]);
                array_push($myWhereHandle[$i], "=");
                array_push($myWhereHandle[$i], $myWhere[$keys[$i]]);
            }
        }

        return $myWhereHandle;
    }

    //wantSelect数组 原[0=>'id'] 现[0=>'id','id'=>值]
    public function getWantSelect(){
        $wantSelect = $this->fillWantSelect();
        $selectLen = count($wantSelect);

        for($w=0;$w<$selectLen;$w++){
            $temp=Db::table($this->tableName)->query("select distinct ".$wantSelect[$w]." from ".$this->tableName);

            //下拉框值默认为空
            $wantSelect[$wantSelect[$w]]=[""];
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

    //id换title(eg:college_id换取college表的title) 用于中文显示
    public function getUseIdExchangeName($wantSelect){
        $temp = [];
        for($i=0;$i<(count($wantSelect)/2);$i++){
            $temp[$wantSelect[$i]]=[];
            array_push($temp[$wantSelect[$i]],$wantSelect[$wantSelect[$i]]);
        }
        
        $useIdExchangeName=[];
        $keys = array_keys($temp);

        //去各个表取title
        for($i=0;$i<count($temp);$i++){
            if(!strcmp($keys[$i], "type_id")){
                for($j=0;$j<count($temp[$keys[$i]][0]);$j++){             
                    if(strcmp($temp[$keys[$i]][0][$j], '')){
                        $result = Db::table('yg_project_type')->field('title')->where('id',$temp[$keys[$i]][0][$j])->find();
                        $useIdExchangeName[$keys[$i]][$temp[$keys[$i]][0][$j]]= $result['title'];
                    }
                }
            }
            else if(!strcmp($keys[$i], "college_id")){
                for($j=0;$j<count($temp[$keys[$i]][0]);$j++){                
                    if(strcmp($temp[$keys[$i]][0][$j], '')){
                        $result = Db::table('yg_college')->field('title')->where('id',$temp[$keys[$i]][0][$j])->find();
                        $useIdExchangeName[$keys[$i]][$temp[$keys[$i]][0][$j]]= $result['title'];
                    }
                }
            }
            else if(!strcmp($keys[$i], "major_id")){
                for($j=0;$j<count($temp[$keys[$i]][0]);$j++){
                    if(strcmp($temp[$keys[$i]][0][$j], '')){
                        $result = Db::table('yg_major')->field('title')->where('id',$temp[$keys[$i]][0][$j])->find();
                        $useIdExchangeName[$keys[$i]][$temp[$keys[$i]][0][$j]]= $result['title'];
                    }
                }
            }
        }
        return $useIdExchangeName;
    }

    //print
    public function printTable($myWhere,$page=1){
        $wantSelect =$this->getWantSelect(); //selectType_id selectYear selectCollege_id selectId selectTitle

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

        //获取所有字段名
        $columns = Db::table($this->tableName)->query("select COLUMN_NAME from information_schema.COLUMNS where table_name='".$this->tableName."'");
        
        $useIdExchangeName=$this->getUseIdExchangeName($wantSelect);

        return [$columns,$wantSelect,$useIdExchangeName,$page,$myWhereHandle,$myWhere,$result];
    }
}
?>